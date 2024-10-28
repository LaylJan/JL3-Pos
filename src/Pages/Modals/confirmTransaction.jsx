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
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/5">
        <h2 className="text-2xl font-semibold mb-4">Confirm Transaction</h2>

        <div className="grid grid-cols-3 gap-4 font-bold">
          <div>Product</div>
          <div>Quantity</div>
          <div>Total</div>
        </div>

        {/* Scrollable product list */}
        <div className="grid grid-cols-3 gap-y-2 gap-x-4 mt-2 h-52 overflow-y-auto auto-rows-min">
          {products.map((product) => (
            <React.Fragment key={product._id}>
              <div>{product.product}</div>
              <div>{product.qty}</div>
              <div>₱{product.price * product.qty}</div>
            </React.Fragment>
          ))}
        </div>

        {/* Fixed total, payment, and change information */}
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
