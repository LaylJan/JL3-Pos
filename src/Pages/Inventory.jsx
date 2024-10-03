import { useState, useEffect } from "react";
import axios from "axios";

const Inventory = ({}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };
  return (
    <div className="flex m-2">
      {/* Product Grid */}
      <div className="w-1/2 grid grid-cols-3 gap-2 p-2">
        {products.map((product, index) => (
          <button
            key={index}
            onClick={() => handleProductClick(product)}
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
      </div>

      {/* Form Container */}
      <div className="w-1/2 p-2 sticky top-0">
        {!selectedProduct ? (
          <h1>Please select an item</h1>
        ) : (
          <form className="mt-2">
            <label htmlFor="productName" className="block font-semibold">
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              value={selectedProduct.Product}
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  Product: e.target.value,
                })
              }
            />

            <label htmlFor="productPrice" className="block mt-2 font-semibold">
              Price:
            </label>
            <input
              type="text"
              id="productPrice"
              value={selectedProduct.Price}
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  Price: e.target.value,
                })
              }
            />

            <label htmlFor="category" className="block mt-2 font-semibold">
              Category:
            </label>
            <input
              type="text"
              id="category"
              value={selectedProduct.Category}
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  Category: e.target.value,
                })
              }
            />

            <label htmlFor="stock" className="block mt-2 font-semibold">
              Stock:
            </label>
            <input
              type="text"
              id="stock"
              value={selectedProduct.Stock}
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  Stock: e.target.value,
                })
              }
            />

            <h2 className="mt-4 font-semibold">Supplier Information</h2>

            <label htmlFor="supplierName" className="block mt-2 font-semibold">
              Supplier Name:
            </label>
            <input
              type="text"
              id="supplierName"
              value={selectedProduct.Supplier?.Name || ""}
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  Supplier: {
                    ...selectedProduct.Supplier,
                    Name: e.target.value,
                  },
                })
              }
            />

            <label
              htmlFor="supplierContact"
              className="block mt-2 font-semibold"
            >
              Supplier Contact:
            </label>
            <input
              type="text"
              id="supplierContact"
              value={selectedProduct.Supplier?.Contact || ""}
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  Supplier: {
                    ...selectedProduct.Supplier,
                    Contact: e.target.value,
                  },
                })
              }
            />

            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white font-semibold p-2 rounded"
            >
              Change
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Inventory;
