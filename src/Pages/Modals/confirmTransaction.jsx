import React from "react";

const ConfirmTransactionModal = ({
  isOpen,
  onClose,
  onConfirm,
  products,
  total,
  payment,
  change,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Confirm Transaction</h2>

        <ul>
          {products.map((product) => (
            <li key={product._id} className="mb-2">
              {product.product} - Qty: {product.qty} - Total: ₱
              {product.price * product.qty}
            </li>
          ))}
        </ul>

        <p className="mt-4">Total: ₱{total}</p>
        <p>Payment: ₱{payment}</p>
        <p>Change: {change !== null ? `₱${change}` : "-"}</p>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTransactionModal;
