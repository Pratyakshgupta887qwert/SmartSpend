import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNotifications } from "../context/NotificationContext";

function AddExpense() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [previewImage, setPreviewImage] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [manualAmount, setManualAmount] = useState("0");
  const [manualDescription, setManualDescription] = useState("");
  const [manualCategory, setManualCategory] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [uploadDescription, setUploadDescription] = useState(
    "Dinner at an Italian restaurant"
  );
  const [uploadCategory, setUploadCategory] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      addNotification({
        title: "Receipt selected",
        message: `${file.name} is ready to save as an expense entry.`,
        type: "info",
      });
    }
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:5030";

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      addNotification({ title: "Error", message: "Please log in first", type: "warning" });
      return;
    }

    let payload = {};

    if (isManual) {
      if (!manualAmount || !manualCategory) {
        addNotification({ title: "Error", message: "Amount and Category are required", type: "warning" });
        return;
      }
      payload = {
        amount: Number(manualAmount),
        categoryName: manualCategory.trim(),
        description: manualDescription,
        spentAt: manualDate ? new Date(manualDate).toISOString() : new Date().toISOString()
      };
    } else {
      if (!previewImage) {
        addNotification({
          title: "No receipt uploaded",
          message: "Please upload a receipt image before saving.",
          type: "warning",
        });
        return;
      }
      payload = {
        amount: 540, // Mock amount for receipt upload since UI has no field
        categoryName: uploadCategory.trim() || "Food & Dining",
        description: uploadDescription,
        spentAt: new Date().toISOString()
      };
    }

    try {
      console.log("Sending expense to backend:", payload);
      const response = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to save expense. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Expense saved successfully:", data);

      addNotification({
        title: "Expense added successfully",
        message: "Your expense has been saved and is now available for tracking.",
        type: "success",
      });

      // Clear form
      if (isManual) {
        setManualAmount("0");
        setManualDescription("");
        setManualCategory("");
        setManualDate("");
        setTimeout(() => navigate("/dashboard"), 100);
      } else {
        setPreviewImage(null);
        setUploadDescription("Dinner at an Italian restaurant");
        setUploadCategory("");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      addNotification({
        title: "Error saving expense",
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <Navbar />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">
              <div className="flex items-center gap-4 border-b border-[#ece4e0] px-5 py-5 md:px-8">
                <button
                  type="button"
                  className="ss-lift flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6f1ee] text-xl text-[#5e5554] transition hover:bg-[#efe7e3]"
                >
                  &#8249;
                </button>
                <h1 className="text-2xl font-semibold tracking-tight text-[#1a1516] md:text-3xl">
                  Add Expense
                </h1>
              </div>

              <div className="border-b border-[#ece4e0] px-5 md:px-8">
                <div className="flex flex-wrap gap-8 md:gap-16">
                  <button
                    type="button"
                    onClick={() => setIsManual(false)}
                    className={`relative py-4 text-2xl font-medium tracking-tight transition ${
                      !isManual ? "text-[#6b6463]" : "text-[#8f8785]"
                    }`}
                  >
                    Upload Receipt
                    {!isManual && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#ff4e45]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsManual(true)}
                    className={`relative py-4 text-2xl font-medium tracking-tight transition ${
                      isManual ? "text-[#6b6463]" : "text-[#8f8785]"
                    }`}
                  >
                    Manual Edit
                    {isManual && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#ff4e45]" />
                    )}
                  </button>
                </div>
              </div>

              {!isManual ? (
                <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-[#ece4e0] p-5 md:border-b-0 md:border-r md:p-8">
                    <div className="rounded-[26px] border border-dashed border-[#f1b9b6] bg-[#fffafa] p-6">
                      <label className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[22px] bg-[#fcf7f6] text-center transition hover:bg-white">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ede6e7] text-4xl text-[#9c9595]">
                          &#8593;
                        </div>

                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <p className="mt-5 text-lg font-medium text-[#706867]">
                          Drag and drop an image
                        </p>

                        <span className="mt-5 rounded-full bg-[#ff4e45] px-6 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(255,78,69,0.85)]">
                          Upload Image
                        </span>
                      </label>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                          Description
                        </label>
                        <input
                          type="text"
                          value={uploadDescription}
                          onChange={(e) => setUploadDescription(e.target.value)}
                          className="w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-lg text-[#57504f] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                          placeholder="Dinner at an Italian restaurant"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                          Category
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-lg text-[#57504f] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                        >
                          <option value="">Select Category</option>
                            <option value="Food & Dining">Food & Dining🍔</option>
                            <option value="HealthCare">HealthCare🏥</option>
                            <option value="Travel & Trips">Travel & Trips 🚞</option>
                            <option value="Personal Care">Personal Care 💅🏻</option>
                            <option value="Entertainment">Entertainment 🎮</option>
                            <option value="Rent/Housing">Rent/Housing 🏘️</option>
                            <option value="Education">Education 📚</option>
                            <option value="Travel">Travel</option>
                            <option value="Shopping">Shopping🛍️</option>
                            <option value="Bills">Bills 🧾</option>
                            <option value="Groceries">Groceries🛒</option>
                            <option value="Others">Others✏️</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSave}
                        className="ss-lift mt-4 rounded-xl bg-[#f3ebea] px-8 py-3 text-lg font-medium text-[#4a4342] transition hover:bg-[#ece2e0]"
                      >
                        Save Draft
                      </button>
                    </div>
                  </div>

                  <div className="p-5 md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-[#1a1516]">
                      Receipt Preview
                    </h2>

                    <div className="mt-6 rounded-[22px] border border-[#ded5d2] bg-[#fcfaf9] p-4">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Receipt Preview"
                          className="h-[380px] w-full rounded-[18px] border border-[#efe7e3] object-contain bg-white"
                        />
                      ) : (
                        <div className="flex h-[380px] items-center justify-center rounded-[18px] border border-dashed border-[#e7deda] bg-[#f8f4f2] text-center text-lg text-[#9b918d]">
                          Uploaded receipt will appear here
                        </div>
                      )}

                      {/* <div className="mt-4 rounded-2xl bg-[#f6f1ee] px-4 py-3 text-sm text-[#4b4343]">
                        <span className="mr-2 text-[#ffb648]">+</span>
                        AI detected: {uploadCategory || "Food"} &nbsp; Rs 540
                        &nbsp; Today
                      </div>  */}
                    </div>

                    <button
                      onClick={handleSave}
                      className="ss-lift mt-10 rounded-xl bg-[#ff4e45] px-10 py-3 text-lg font-medium text-white shadow-[0_16px_30px_-18px_rgba(255,78,69,0.9)] transition hover:bg-[#f1453d]"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_0.95fr]">
                  <div className="border-b border-[#ece4e0] p-5 md:border-b-0 md:border-r md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-[#1a1516]">
                      Receipt Preview
                    </h2>

                    <div className="mt-4 rounded-[22px] border border-[#d9cdca] bg-[#f9f3f6] p-5">
                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                            Amount
                          </label>
                          <input
                            type="text"
                            value={manualAmount}
                            onChange={(e) => setManualAmount(e.target.value)}
                            className="w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-2xl text-[#1a1516] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                            Description
                          </label>
                          <input
                            type="text"
                            value={manualDescription}
                            onChange={(e) => setManualDescription(e.target.value)}
                            className="w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-lg text-[#57504f] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                            Category
                          </label>
                          <select
                            value={manualCategory}
                            onChange={(e) => setManualCategory(e.target.value)}
                            className="w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-lg text-[#57504f] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                          >
                            <option value="">Select Category</option>
                            <option value="Food & Dining">Food & Dining🍔</option>
                            <option value="HealthCare">HealthCare🏥</option>
                            <option value="Travel & Trips">Travel & Trips 🚞</option>
                            <option value="Personal Care">Personal Care 💅🏻</option>
                            <option value="Entertainment">Entertainment 🎮</option>
                            <option value="Rent/Housing">Rent/Housing 🏘️</option>
                            <option value="Education">Education 📚</option>
                            <option value="Travel">Travel</option>
                            <option value="Shopping">Shopping🛍️</option>
                            <option value="Bills">Bills 🧾</option>
                            <option value="Groceries">Groceries🛒</option>
                            <option value="Others">Others✏️</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                            Date
                          </label>
                          <input
                            type="date"
                            value={manualDate}
                            onChange={(e) => setManualDate(e.target.value)}
                            className="w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-lg text-[#57504f] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSave}
                        className="ss-lift mt-8 rounded-xl bg-[#f3ebea] px-8 py-3 text-lg font-medium text-[#4a4342] transition hover:bg-[#ece2e0]"
                      >
                        Save Draft
                      </button>
                    </div>
                  </div>

                  <div className="p-5 md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-[#1a1516]">
                      Receipt Preview
                    </h2>
                    <p className="mt-2 text-lg text-[#7e7673]">
                      Double check your receipt details below
                    </p>

                    <div className="mt-6 rounded-[22px] border border-[#ded5d2] bg-white p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.25)]">
                      <div className="space-y-5">
                        <div className="border-b border-[#e9dfdc] pb-4">
                          <p className="text-4xl font-semibold tracking-tight text-[#1a1516]">
                            Rs {manualAmount || "0"}
                          </p>
                        </div>

                        <div className="border-b border-[#e9dfdc] pb-4">
                          <p className="text-xl text-[#47403f]">
                            {manualDescription || "No description added"}
                          </p>
                          <div className="mt-3 inline-flex rounded-xl bg-[#ece6e2] px-3 py-2 text-lg text-[#5e5554]">
                            {manualCategory || "No category selected"}
                          </div>
                        </div>

                        <div className="border-b border-[#e9dfdc] pb-4">
                          <p className="text-lg text-[#8b817e]">Date</p>
                          <div className="mt-3 inline-flex rounded-lg bg-[#f2edeb] px-3 py-2 text-lg text-[#6a6260]">
                            {manualDate || "No date selected"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-medium text-[#1a1516]">
                            Total
                          </p>
                          <p className="text-2xl font-semibold text-[#1a1516]">
                            Rs {manualAmount || "0"}.00
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      className="ss-lift mt-10 rounded-xl bg-[#ff4e45] px-10 py-3 text-lg font-medium text-white shadow-[0_16px_30px_-18px_rgba(255,78,69,0.9)] transition hover:bg-[#f1453d]"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
