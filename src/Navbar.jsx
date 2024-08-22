import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({}) => {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="bg-green-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-lg">
            <a href="/">JL3 POS</a>
          </div>
          <div className="flex space-x-6">
            <a href="/" className="text-white hover:text-gray-300">
              Cashier
            </a>
            <a href="/inventory" className="text-white hover:text-gray-300">
              Inventory
            </a>
            <a href="/sales" className="text-white hover:text-gray-300">
              Sales
            </a>
            <a href="/refund  " className="text-white hover:text-gray-300">
              Refund
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
