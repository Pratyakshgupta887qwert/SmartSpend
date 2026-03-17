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
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Upload Receipt
          </h1>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4">
                Upload Receipt
              </h2>

              <label className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-blue-500 transition">

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <span className="text-gray-500">
                  Click to upload receipt image
                </span>

              </label>


              {/* Save Button */}
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
              >
                Save Expense
              </button>

            </div>


            {/* Preview Section */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4">
                Receipt Preview
              </h2>

              {previewImage ? (

                <img
                  src={previewImage}
                  alt="Receipt Preview"
                  className="rounded-lg w-full max-h-80 object-contain"
                />

              ) : (

                <div className="flex items-center justify-center h-40 text-gray-400">
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