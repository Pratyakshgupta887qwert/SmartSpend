import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function UploadReceipt() {

  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleSave = () => {
    console.log("Receipt saved");
  };

  return (
    <div className="flex ss-app-bg min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <div className="p-4 md:p-8">

          <h1 className="ss-title text-3xl mb-8">
            Upload Receipt
          </h1>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Upload Section */}
            <div className="ss-card p-6">

              <h2 className="text-lg font-semibold text-[#163122] mb-4">
                Upload Receipt
              </h2>

              <label className="border-2 border-dashed border-green-200 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-green-500 bg-green-50/40 transition">

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <span className="text-slate-500 font-medium">
                  Click to upload receipt image
                </span>

              </label>


              {/* Save Button */}
              <button
                onClick={handleSave}
                className="ss-btn-primary text-white px-6 py-3 mt-6"
              >
                Save Expense
              </button>

            </div>


            {/* Preview Section */}
            <div className="ss-card p-6">

              <h2 className="text-lg font-semibold text-[#163122] mb-4">
                Receipt Preview
              </h2>

              {previewImage ? (

                <img
                  src={previewImage}
                  alt="Receipt Preview"
                  className="rounded-lg w-full max-h-80 object-contain border border-green-100"
                />

              ) : (

                <div className="flex items-center justify-center h-40 text-slate-400 border border-dashed border-green-200 rounded-lg bg-green-50/30">
                  Uploaded receipt will appear here
                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UploadReceipt;