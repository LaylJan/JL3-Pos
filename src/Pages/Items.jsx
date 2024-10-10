import { useState, useEffect } from "react";
import axios from "axios";

const Items = ({}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the local backend when the component mounts
    axios
      .get("http://localhost:5000/api/Products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });

    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const change = JSON.parse(event.data);
      console.log("Received change from WebSocket:", change);

      // Handle different types of changes
      switch (change.operationType) {
        case "insert":
          setProducts((prevProducts) => [...prevProducts, change.fullDocument]);
          break;
        case "update":
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === change.documentKey._id
                ? { ...product, ...change.updateDescription.updatedFields }
                : product
            )
          );
          break;
        case "delete":
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== change.documentKey._id
            )
          );
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const handleAddToReceipt = (product) => {
    // Check if the product is already in the receipt
    console.log("Product passed to function:", product.Product);
    axios
      .get(`http://localhost:5000/api/Receipt?product=${product.Product}`)
      .then((response) => {
        const receiptItem = response.data;

        if (receiptItem) {
          console.log("Found receipt item:", receiptItem);

          // Use _id or id depending on what is available
          const receiptItemId = receiptItem._id || receiptItem.id;

          if (!receiptItemId) {
            console.error("Receipt item ID is missing.");
            return;
          }

          // If the product is already in the receipt, increment the quantity
          axios
            .put(`http://localhost:5000/api/Receipt/${receiptItemId}`, {
              qty: receiptItem.qty + 1, // Increment quantity
            })
            .then((res) => {
              console.log("Quantity incremented", res.data);
            })
            .catch((err) => console.error("Failed to increment qty", err));
        } else {
          // If the product is not in the receipt, add it to the receipt with quantity 1
          console.log("Product not in receipt, adding it now.");
          axios
            .post("http://localhost:5000/api/Receipt", {
              product: product.Product,
              qty: 1,
              price: product.Price,
              total: product.Price * 1, // Initial total = price * 1
            })
            .then((res) => {
              console.log("Product added to receipt", res.data);
            })
            .catch((err) => console.error("Failed to add to receipt", err));
        }
      })
      .catch((err) => console.error("Error fetching receipt", err));
  };
  return (
    <div className="grid grid-cols-4 gap-4 p-2">
      {products.map((product, index) => (
        <button
          key={index}
          className="bg-white border shadow-sm rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 ease-in-out w-[10rem] h-[10rem] break-words flex items-center justify-center"
          onClick={() => handleAddToReceipt(product)}
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
