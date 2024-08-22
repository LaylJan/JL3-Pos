import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Cashier from "./Pages/Items";
import Inventory from "./Pages/Inventory";
import Sales from "./Pages/Sales";
import Refund from "./Pages/Refund";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the local backend
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Cashier /> <h1>asd</h1>
              </div>
            }
          />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/refund" element={<Refund />} />
        </Routes>
      </Router>

      {/* <h2 className="text-xl">Product List</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.Product} - {product.Price}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default App;
