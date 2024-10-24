import React from "react";

const VoidModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Are you sure you want to void?
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoidModal;
