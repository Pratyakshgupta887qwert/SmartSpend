import React, { useMemo, useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNotifications } from "../context/NotificationContext";

const STORAGE_KEY = "smartspend_upcoming_bills";

function loadBills() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Pulse() {
  const { addNotification } = useNotifications();
  const [bills, setBills] = useState(loadBills);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "Utilities",
  });

  const totalUpcoming = useMemo(
    () => bills.filter((bill) => !bill.paid).reduce((sum, bill) => sum + Number(bill.amount || 0), 0),
    [bills]
  );

  const persistBills = (nextBills) => {
    setBills(nextBills);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBills));
  };

  const handleAddBill = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.amount || !form.dueDate) {
      addNotification({
        title: "Missing details",
        message: "Please fill title, amount, and due date to add a bill.",
        type: "warning",
      });
      return;
    }

    const next = [
      {
        id: Date.now() + Math.random(),
        title: form.title.trim(),
        amount: Number(form.amount),
        dueDate: form.dueDate,
        category: form.category,
        paid: false,
      },
      ...bills,
    ].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    persistBills(next);
    setForm({ title: "", amount: "", dueDate: "", category: "Utilities" });

    addNotification({
      title: "Upcoming bill added",
      message: "Your bill has been saved to Pulse and will appear in AI insights too.",
      type: "success",
    });
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:5030";

  const togglePaid = async (id) => {
    const billToUpdate = bills.find((b) => b.id === id);
    if (!billToUpdate) return;

    if (!billToUpdate.paid) {
      const token = localStorage.getItem("token");
      if (!token) {
        addNotification({ title: "Error", message: "Please log in first", type: "warning" });
        return;
      }

      try {
        const payload = {
          amount: Number(billToUpdate.amount),
          categoryName: billToUpdate.category || "Utilities",
          description: billToUpdate.title || "Bill Payment",
          spentAt: new Date().toISOString()
        };

        const response = await fetch(`${API_BASE}/api/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Failed to save to expenses. Status: ${response.status}`);
        }

        const data = await response.json();

        addNotification({
          title: "Paid & Tracked!",
          message: `${billToUpdate.title} was marked as paid and added to your dashboard expenses!`,
          type: "success",
        });

        const next = bills.map((bill) =>
          bill.id === id ? { ...bill, paid: true, expenseId: data.id || data.Id || data.id } : bill
        );
        persistBills(next);

      } catch (error) {
        console.error("Error saving bill as expense:", error);
        addNotification({
          title: "Error tracking bill",
          message: error.message,
          type: "error",
        });
        return; // Prevent marking as paid if backend fails
      }
    } else {
      // Logic for toggling from Paid -> Unpaid
      if (billToUpdate.expenseId) {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`${API_BASE}/api/expenses/${billToUpdate.expenseId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!response.ok) {
            console.error("Failed to untrack expense from backend");
          } else {
            addNotification({
              title: "Untracked",
              message: `${billToUpdate.title} was marked unpaid and removed from dashboard.`,
              type: "success",
            });
          }
        } catch (error) {
          console.error("Error deleting tracking expense:", error);
        }
      }

      const next = bills.map((bill) =>
        bill.id === id ? { ...bill, paid: false, expenseId: null } : bill
      );
      persistBills(next);
    }
  };

  const removeBill = async (id) => {
    const billToRemove = bills.find((b) => b.id === id);
    if (!billToRemove) return;

    if (billToRemove.paid && billToRemove.expenseId) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE}/api/expenses/${billToRemove.expenseId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          console.error("Failed to delete backend expense for the removed bill");
        } else {
            addNotification({
              title: "Untracked",
              message: `${billToRemove.title} was removed completely from expenses.`,
              type: "success",
            });
        }
      } catch (error) {
        console.error("Error deleting tracking expense:", error);
      }
    }

    const next = bills.filter((bill) => bill.id !== id);
    persistBills(next);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <Navbar />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-[30px] border border-[#ece3de] bg-white p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.34)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9f9490]">Pulse Center</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1a1516] sm:text-4xl">
                    Upcoming Bills
                  </h1>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f1ee] px-4 py-2 text-sm font-semibold text-[#605655]">
                  <CalendarClock size={15} />
                  Pending total: Rs {totalUpcoming.toLocaleString()}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.25fr]">
              <section className="rounded-[28px] border border-[#ece3de] bg-white p-5 shadow-[0_20px_55px_-34px_rgba(15,23,42,0.34)]">
                <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">Add Upcoming Bill</h2>

                <form onSubmit={handleAddBill} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#504746]">Bill Name</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                      className="w-full rounded-xl border border-[#d9ceca] bg-[#fcfaf9] px-4 py-3 text-sm outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                      placeholder="Rent, Netflix, Electricity..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#504746]">Amount (Rs)</label>
                      <input
                        type="number"
                        value={form.amount}
                        onChange={(event) => setForm((previous) => ({ ...previous, amount: event.target.value }))}
                        className="w-full rounded-xl border border-[#d9ceca] bg-[#fcfaf9] px-4 py-3 text-sm outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#504746]">Due Date</label>
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(event) => setForm((previous) => ({ ...previous, dueDate: event.target.value }))}
                        className="w-full rounded-xl border border-[#d9ceca] bg-[#fcfaf9] px-4 py-3 text-sm outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#504746]">Category</label>
                    <select
                      value={form.category}
                      onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                      className="w-full rounded-xl border border-[#d9ceca] bg-[#fcfaf9] px-4 py-3 text-sm outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                    >
                      <option value="Utilities">Utilities</option>
                      <option value="Rent">Rent</option>
                      <option value="Subscription">Subscription</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d84843] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(216,72,67,0.95)] transition hover:bg-[#ca3e39]"
                  >
                    <Plus size={14} />
                    Save Bill
                  </button>
                </form>
              </section>

              <section className="rounded-[28px] border border-[#ece3de] bg-white p-5 shadow-[0_20px_55px_-34px_rgba(15,23,42,0.34)]">
                <h2 className="text-2xl font-bold tracking-tight text-[#1a1516]">Saved Upcoming Bills</h2>

                <div className="mt-4 space-y-3">
                  {bills.map((bill) => (
                    <div key={bill.id} className="rounded-2xl border border-[#efe7e3] bg-[#fcfaf9] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className={`font-semibold ${bill.paid ? "text-[#8f8582] line-through" : "text-[#1a1516]"}`}>
                            {bill.title}
                          </p>
                          <p className="text-xs text-[#8f8583]">{bill.category} • Due {new Date(bill.dueDate).toLocaleDateString("en-IN")}</p>
                        </div>
                        <p className={`font-bold ${bill.paid ? "text-[#8f8582]" : "text-[#1a1516]"}`}>
                          Rs {Number(bill.amount).toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => togglePaid(bill.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            bill.paid
                              ? "bg-[#e6f6ea] text-[#1e7e3d]"
                              : "bg-[#f6f1ee] text-[#5d5352] hover:bg-[#ece3df]"
                          }`}
                        >
                          {bill.paid ? "Paid" : "Mark as Paid"}
                        </button>

                        <button
                          onClick={() => removeBill(bill.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#f6f1ee] px-3 py-1.5 text-xs font-semibold text-[#6f6664] transition hover:bg-[#ece3df]"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {bills.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#e8ddd8] bg-[#fcfaf9] p-5 text-sm text-[#857a77]">
                      No upcoming bills yet. Add your first bill from the form to start tracking.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pulse;
