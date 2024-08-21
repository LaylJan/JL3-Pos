import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

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
