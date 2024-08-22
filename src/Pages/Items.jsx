import { useState, useEffect } from "react";
import axios from "axios";

const Items = ({}) => {
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
    <div className="grid grid-cols-4 gap-4 p-2">
      {products.map((product, index) => (
        <button
          key={index}
          className="bg-white border shadow-sm rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 ease-in-out w-[10rem] h-[10rem] break-words flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-gray-800 font-semibold text-lg break-words">
              {product.Product}
            </p>
            <p className="text-gray-500 text-sm mt-1">₱{product.Price}</p>
          </div>
        </button>
      ))}
      <button
        // key={index}
        className="bg-white border shadow-sm rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 ease-in-out w-[10rem] h-[10rem] break-words flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg break-words">
            Trimetazitine (5mg)
          </p>
          <p className="text-gray-500 text-sm mt-1">₱10</p>
        </div>
      </button>
    </div>
  );
};

export default Items;
