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

    // Initialize an empty object to store receipt items
    const receiptItems = {};

    // Fetch all items in the receipt
    axios
      .get(`http://localhost:5000/api/Receipt`)
      .then((response) => {
        const items = response.data; // Assume this is an array of receipt items

        // Populate the receiptItems object
        items.forEach((item) => {
          receiptItems[item.product] = item; // Use product name as the key
        });

        if (receiptItems[product.Product]) {
          // Product exists in the receipt, increment the qty
          const existingItem = receiptItems[product.Product];
          const updatedQty = existingItem.qty + 1;
          const updatedTotal = updatedQty * existingItem.price;

          // Send PUT request to update the existing receipt entry
          axios
            .put(`http://localhost:5000/api/Receipt/${existingItem._id}`, {
              qty: updatedQty,
              total: updatedTotal,
            })
            .then(() => {
              console.log(
                "Successfully updated receipt with incremented quantity"
              );
            })
            .catch((error) => {
              console.error("Error updating receipt:", error);
            });
        } else {
          // Product does not exist in the receipt, create a new entry
          const newReceiptItem = {
            product: product.Product,
            price: product.Price,
            qty: 1, // initial quantity
            total: product.Price, // initial total
            amount: product.Price, // total amount (assuming it's same as price initially)
          };

          axios
            .post("http://localhost:5000/api/Receipt", newReceiptItem)
            .then(() => {
              console.log("Successfully added new item to the receipt");
            })
            .catch((error) => {
              console.error("Error adding item to the receipt:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching receipt items:", error);
      });
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
