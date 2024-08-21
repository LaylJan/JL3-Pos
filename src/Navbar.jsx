import { useState } from "react";
import logo from "../assets/JL3 logo.png";
import "./App.css";

const Navbar = ({}) => {
  return (
    <div>
      <nav className="bg-green-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-lg">
            {/* <img src={logo} alt="Logo" className="h-10" /> */}
            <a href="/">JL3 POS</a>
          </div>
          <div className="flex space-x-6">
            <a href="/" className="text-white hover:text-gray-300">
              Cashier
            </a>
            <a href="/about" className="text-white hover:text-gray-300">
              Inventory
            </a>
            <a href="/services" className="text-white hover:text-gray-300">
              Sales
            </a>
            <a href="/contact" className="text-white hover:text-gray-300">
              Refund
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
