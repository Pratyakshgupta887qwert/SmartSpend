import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNotifications } from "../context/NotificationContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:5030";

function AddExpense() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef(null);

  // ── shared ──────────────────────────────────────────────────────────────────
  const [isManual, setIsManual] = useState(false);

  // ── upload-receipt tab ───────────────────────────────────────────────────────
  const [previewImage, setPreviewImage]       = useState(null);
  const [selectedFile, setSelectedFile]       = useState(null);
  const [isScanning, setIsScanning]           = useState(false);
  const [ocrError, setOcrError]               = useState("");

  // fields auto-filled by OCR (user can still edit them)
  const [uploadAmount,      setUploadAmount]      = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory,    setUploadCategory]    = useState("");
  const [uploadDate,        setUploadDate]        = useState("");
  const [uploadMerchant,    setUploadMerchant]    = useState("");

  // ── manual-edit tab ──────────────────────────────────────────────────────────
  const [manualAmount,      setManualAmount]      = useState("0");
  const [manualDescription, setManualDescription] = useState("");
  const [manualCategory,    setManualCategory]    = useState("");
  const [manualDate,        setManualDate]        = useState("");

  // ── OCR call ─────────────────────────────────────────────────────────────────
  const runOcr = async (file) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsScanning(true);
    setOcrError("");

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const response = await fetch(`${API_BASE}/api/receipt-ocr/extract`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `OCR failed (${response.status})`);
      }

      const data = await response.json();

      // Auto-fill every field from the OCR result
      if (data.amount != null) setUploadAmount(String(data.amount));
      if (data.description)    setUploadDescription(data.description);
      if (data.category)       setUploadCategory(data.category);
      if (data.date)           setUploadDate(data.date);          // yyyy-MM-dd
      if (data.merchant)       setUploadMerchant(data.merchant);

      addNotification({
        title: "Receipt scanned",
        message: `Detected ₹${data.amount ?? "?"} from ${data.merchant || "receipt"}.`,
        type: "success",
      });
    } catch (err) {
      console.error("OCR error:", err);
      setOcrError("Could not read receipt. Please fill the fields manually.");
      addNotification({
        title: "Scan failed",
        message: err.message,
        type: "error",
      });
    } finally {
      setIsScanning(false);
    }
  };

  // ── file picker ───────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // reset previous OCR state
    setUploadAmount("");
    setUploadDescription("");
    setUploadCategory("");
    setUploadDate("");
    setUploadMerchant("");
    setOcrError("");

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));

    runOcr(file);
  };

  // ── save ──────────────────────────────────────────────────────────────────────
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
        amount:       Number(manualAmount),
        categoryName: manualCategory.trim(),
        description:  manualDescription,
        spentAt:      manualDate ? new Date(manualDate).toISOString() : new Date().toISOString(),
      };
    } else {
      if (!selectedFile) {
        addNotification({ title: "No receipt uploaded", message: "Please upload a receipt image before saving.", type: "warning" });
        return;
      }
      if (isScanning) {
        addNotification({ title: "Still scanning", message: "Please wait while we finish reading your receipt.", type: "info" });
        return;
      }
      if (!uploadAmount || Number(uploadAmount) <= 0) {
        addNotification({ title: "Amount missing", message: "Enter the receipt amount before saving.", type: "warning" });
        return;
      }
      payload = {
        amount:       Number(uploadAmount),
        categoryName: (uploadCategory || "Others").trim(),
        description:  uploadDescription || uploadMerchant || "Receipt expense",
        spentAt:      uploadDate ? new Date(uploadDate).toISOString() : new Date().toISOString(),
      };
    }

    try {
      console.log("Sending expense to backend:", payload);
      const response = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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

      if (isManual) {
        setManualAmount("0");
        setManualDescription("");
        setManualCategory("");
        setManualDate("");
      } else {
        setPreviewImage(null);
        setSelectedFile(null);
        setUploadAmount("");
        setUploadDescription("");
        setUploadCategory("");
        setUploadDate("");
        setUploadMerchant("");
      }

      setTimeout(() => navigate("/dashboard"), 100);
    } catch (error) {
      console.error("Error saving expense:", error);
      addNotification({ title: "Error saving expense", message: error.message, type: "error" });
    }
  };

  // ── helpers ───────────────────────────────────────────────────────────────────
  const categoryOptions = [
    { value: "Food & Dining",    label: "Food & Dining 🍔" },
    { value: "HealthCare",       label: "HealthCare 🏥" },
    { value: "Travel & Trips",   label: "Travel & Trips 🚞" },
    { value: "Personal Care",    label: "Personal Care 💅🏻" },
    { value: "Entertainment",    label: "Entertainment 🎮" },
    { value: "Rent/Housing",     label: "Rent/Housing 🏘️" },
    { value: "Education",        label: "Education 📚" },
    { value: "Travel",           label: "Travel ✈️" },
    { value: "Shopping",         label: "Shopping 🛍️" },
    { value: "Bills",            label: "Bills 🧾" },
    { value: "Groceries",        label: "Groceries 🛒" },
    { value: "Others",           label: "Others ✏️" },
  ];

  const inputCls =
    "w-full rounded-lg border border-[#cfc4c0] bg-[#faf7f5] px-4 py-3 text-lg text-[#57504f] outline-none transition focus:border-[#d84843] focus:ring-4 focus:ring-[#d84843]/10";

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#171214]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f1ee]">
        <Navbar />

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)] ring-1 ring-black/5">

              {/* header */}
              <div className="flex items-center gap-4 border-b border-[#ece4e0] px-5 py-5 md:px-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="ss-lift flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6f1ee] text-xl text-[#5e5554] transition hover:bg-[#efe7e3]"
                >
                  ‹
                </button>
                <h1 className="text-2xl font-semibold tracking-tight text-[#1a1516] md:text-3xl">
                  Add Expense
                </h1>
              </div>

              {/* tabs */}
              <div className="border-b border-[#ece4e0] px-5 md:px-8">
                <div className="flex flex-wrap gap-8 md:gap-16">
                  {[
                    { label: "Upload Receipt", active: !isManual, onClick: () => setIsManual(false) },
                    { label: "Manual Edit",    active: isManual,  onClick: () => setIsManual(true)  },
                  ].map(({ label, active, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={onClick}
                      className={`relative py-4 text-2xl font-medium tracking-tight transition ${
                        active ? "text-[#6b6463]" : "text-[#8f8785]"
                      }`}
                    >
                      {label}
                      {active && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#ff4e45]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── UPLOAD RECEIPT TAB ──────────────────────────────────────── */}
              {!isManual ? (
                <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">

                  {/* left: upload + editable fields */}
                  <div className="border-b border-[#ece4e0] p-5 md:border-b-0 md:border-r md:p-8">

                    {/* drop zone */}
                    <div className="rounded-[26px] border border-dashed border-[#f1b9b6] bg-[#fffafa] p-6">
                      <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[22px] bg-[#fcf7f6] text-center transition hover:bg-white">
                        {isScanning ? (
                          <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ef]">
                              <svg className="h-8 w-8 animate-spin text-[#ff4e45]" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                            </div>
                            <p className="mt-4 text-lg font-medium text-[#ff4e45]">Scanning receipt…</p>
                            <p className="mt-1 text-sm text-[#9b918d]">AI is reading your receipt</p>
                          </>
                        ) : (
                          <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ede6e7] text-4xl text-[#9c9595]">
                              ↑
                            </div>
                            <p className="mt-5 text-lg font-medium text-[#706867]">
                              {selectedFile ? selectedFile.name : "Drag and drop an image"}
                            </p>
                            <span className="mt-5 rounded-full bg-[#ff4e45] px-6 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(255,78,69,0.85)]">
                              {selectedFile ? "Change Image" : "Upload Image"}
                            </span>
                          </>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    {/* OCR error banner */}
                    {ocrError && (
                      <div className="mt-4 rounded-xl bg-[#fff0ef] px-4 py-3 text-sm text-[#c0392b]">
                        ⚠️ {ocrError}
                      </div>
                    )}

                    {/* editable OCR fields */}
                    <div className="mt-6 space-y-5">

                      {/* Amount — shown only after a file is selected */}
                      {selectedFile && (
                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">
                            Amount (₹)
                            {isScanning && (
                              <span className="ml-2 text-sm font-normal text-[#ff4e45] animate-pulse">detecting…</span>
                            )}
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={uploadAmount}
                            onChange={(e) => setUploadAmount(e.target.value)}
                            className={inputCls}
                            placeholder="0.00"
                          />
                        </div>
                      )}

                      <div>
                        <label className="mb-2 block text-lg font-medium text-[#1a1516]">Description</label>
                        <input
                          type="text"
                          value={uploadDescription}
                          onChange={(e) => setUploadDescription(e.target.value)}
                          className={inputCls}
                          placeholder="e.g. Dinner at an Italian restaurant"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-lg font-medium text-[#1a1516]">Category</label>
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className={inputCls}
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-lg font-medium text-[#1a1516]">Date</label>
                        <input
                          type="date"
                          value={uploadDate}
                          onChange={(e) => setUploadDate(e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      <button
                        onClick={handleSave}
                        disabled={isScanning}
                        className="ss-lift mt-4 rounded-xl bg-[#f3ebea] px-8 py-3 text-lg font-medium text-[#4a4342] transition hover:bg-[#ece2e0] disabled:opacity-50"
                      >
                        Save Draft
                      </button>
                    </div>
                  </div>

                  {/* right: receipt preview */}
                  <div className="p-5 md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-[#1a1516]">Receipt Preview</h2>

                    <div className="mt-6 rounded-[22px] border border-[#ded5d2] bg-[#fcfaf9] p-4">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Receipt Preview"
                          className="h-[300px] w-full rounded-[18px] border border-[#efe7e3] object-contain bg-white"
                        />
                      ) : (
                        <div className="flex h-[300px] items-center justify-center rounded-[18px] border border-dashed border-[#e7deda] bg-[#f8f4f2] text-center text-lg text-[#9b918d]">
                          Uploaded receipt will appear here
                        </div>
                      )}

                      {/* OCR summary chip */}
                      {!isScanning && uploadAmount && (
                        <div className="mt-4 rounded-2xl bg-[#f6f1ee] px-4 py-3 text-sm text-[#4b4343] flex items-center gap-2">
                          <span className="text-[#ff4e45] font-bold">✦</span>
                          <span>
                            <span className="font-semibold">AI detected:</span>{" "}
                            {uploadCategory || "Others"} &nbsp;·&nbsp; ₹{uploadAmount}
                            {uploadDate && <> &nbsp;·&nbsp; {uploadDate}</>}
                          </span>
                        </div>
                      )}

                      {isScanning && (
                        <div className="mt-4 rounded-2xl bg-[#fff8f7] px-4 py-3 text-sm text-[#ff4e45] flex items-center gap-2 animate-pulse">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Scanning receipt with AI…
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={isScanning}
                      className="ss-lift mt-10 rounded-xl bg-[#ff4e45] px-10 py-3 text-lg font-medium text-white shadow-[0_16px_30px_-18px_rgba(255,78,69,0.9)] transition hover:bg-[#f1453d] disabled:opacity-50"
                    >
                      {isScanning ? "Scanning…" : "Submit"}
                    </button>
                  </div>
                </div>

              ) : (
              /* ── MANUAL EDIT TAB ──────────────────────────────────────────── */
                <div className="grid grid-cols-1 md:grid-cols-[1fr_0.95fr]">
                  <div className="border-b border-[#ece4e0] p-5 md:border-b-0 md:border-r md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-[#1a1516]">Receipt Preview</h2>

                    <div className="mt-4 rounded-[22px] border border-[#d9cdca] bg-[#f9f3f6] p-5">
                      <div className="space-y-5">

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">Amount</label>
                          <input
                            type="text"
                            value={manualAmount}
                            onChange={(e) => setManualAmount(e.target.value)}
                            className={`${inputCls} text-2xl`}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">Description</label>
                          <input
                            type="text"
                            value={manualDescription}
                            onChange={(e) => setManualDescription(e.target.value)}
                            className={inputCls}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">Category</label>
                          <select
                            value={manualCategory}
                            onChange={(e) => setManualCategory(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">Select Category</option>
                            {categoryOptions.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-lg font-medium text-[#1a1516]">Date</label>
                          <input
                            type="date"
                            value={manualDate}
                            onChange={(e) => setManualDate(e.target.value)}
                            className={inputCls}
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

                  {/* manual preview panel */}
                  <div className="p-5 md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-[#1a1516]">Receipt Preview</h2>
                    <p className="mt-2 text-lg text-[#7e7673]">Double check your receipt details below</p>

                    <div className="mt-6 rounded-[22px] border border-[#ded5d2] bg-white p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.25)]">
                      <div className="space-y-5">
                        <div className="border-b border-[#e9dfdc] pb-4">
                          <p className="text-4xl font-semibold tracking-tight text-[#1a1516]">
                            ₹ {manualAmount || "0"}
                          </p>
                        </div>
                        <div className="border-b border-[#e9dfdc] pb-4">
                          <p className="text-xl text-[#47403f]">{manualDescription || "No description added"}</p>
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
                          <p className="text-2xl font-medium text-[#1a1516]">Total</p>
                          <p className="text-2xl font-semibold text-[#1a1516]">₹ {manualAmount || "0"}.00</p>
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