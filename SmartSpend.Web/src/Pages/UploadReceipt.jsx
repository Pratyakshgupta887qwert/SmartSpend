import { useState } from "react";

function UploadReceipt() {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
 


    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-8">Upload Receipt</h1>

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT: Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium mb-2">Upload Receipt</h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload a receipt image to extract expense details
            </p>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              id="receiptUpload"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload box */}
            <label
              htmlFor="receiptUpload"
              className="flex items-center justify-center h-44
                         border-2 border-dashed border-gray-300 
                         rounded-lg cursor-pointer
                         text-gray-500 text-sm
                         hover:bg-gray-50 transition"
            >
              {previewImage
                ? "Click to change receipt image"
                : "Click to upload receipt image"}
            </label>
          </div>

          {/* RIGHT: Preview Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium mb-2">Receipt Preview</h2>
            <p className="text-sm text-gray-500 mb-4">
              Selected receipt image preview
            </p>

            <p className="text-xs text-gray-400 mb-2">
              Preview of uploaded receipt
            </p>

            {previewImage ? (
              <img
                src={previewImage}
                alt="Receipt Preview"
                className="w-full max-h-80 object-contain rounded-lg border mb-4"
              />
            ) : (
              <div className="border rounded-lg p-6 text-sm text-gray-400 text-center mb-4">
                No receipt uploaded yet
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded-md border border-gray-300 
                           text-gray-600 hover:bg-gray-100 transition"
              >
                Edit
              </button>

              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 
                           text-white hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
   
   // </div>
  );
}

export default UploadReceipt;
