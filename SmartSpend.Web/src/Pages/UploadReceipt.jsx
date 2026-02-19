function UploadReceipt() {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Upload Receipt</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Upload Receipt</h2>

          <input
            type="file"
            accept="image/*"
            id="receiptUpload"
            className="hidden"
            onChange={handleFileChange}
          />

          <label
            htmlFor="receiptUpload"
            className="block w-full h-40 border-2 border-dashed border-gray-300 
                       rounded-md flex items-center justify-center 
                       text-gray-500 cursor-pointer hover:bg-gray-50"
          >
            Click here to upload receipt
          </label>
        </div>

        {/* Preview Section */}
          <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Receipt Preview</h2>
          <p className="text-gray-500 text-sm">
            Uploaded receipt details will appear here.
          </p>
        </div>

      </div>
    </div>
  );
}

export default UploadReceipt;
