import { useState, useEffect } from "react";
import axios from "axios";

const Reciept = ({}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the local backend when the component mounts
    axios
      .get("http://localhost:5000/api/receipt")
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
  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase"
              >
                Qty
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">
                  {product.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  ₱{product.price}
                </td>
                <td className="flex items-center justify-center px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  <button
                    className="bg-white border shadow-sm rounded-lg p-2 pt-1 w-[3rem] h-[2rem] hover:bg-gray-100 transition-all duration-200 ease-in-out break-words flex items-center justify-center"
                    onClick={() => {
                      if (product.qty > 1) {
                        // Update the qty in the backend
                        axios
                          .put(
                            `http://localhost:5000/api/receipt/${product._id}`,
                            {
                              qty: product.qty - 1,
                            }
                          )
                          .then((response) => {
                            // Update the state after successful backend update
                            setProducts((prevProducts) =>
                              prevProducts.map((p) =>
                                p._id === product._id
                                  ? { ...p, qty: p.qty - 1 }
                                  : p
                              )
                            );
                          })
                          .catch((error) => {
                            console.error("Failed to update qty", error);
                          });
                      } else {
                        // If the quantity reaches 0, delete the receipt entry
                        axios
                          .delete(
                            `http://localhost:5000/api/receipt/${product.product}`
                          )
                          .then(() => {
                            // Remove the product from the state after successful deletion
                            setProducts((prevProducts) =>
                              prevProducts.filter(
                                (p) => p.product !== product.product
                              )
                            );
                          })
                          .catch((error) => {
                            console.error(
                              "Failed to delete the receipt",
                              error
                            );
                          });
                      }
                    }}
                  >
                    <div className="text-center">
                      <p className="text-gray-800 font-semibold text-xl break-words">
                        -
                      </p>
                    </div>
                  </button>
                  <div className="m-1">{product.qty}</div>
                  <button
                    className="bg-white border shadow-sm rounded-lg p-2 pt-1 w-[3rem] h-[2rem] hover:bg-gray-100 transition-all duration-200 ease-in-out break-words flex items-center justify-center"
                    onClick={() => {
                      // Update the qty in the backend
                      axios
                        .put(
                          `http://localhost:5000/api/receipt/${product._id}`,
                          {
                            qty: product.qty + 1,
                          }
                        )
                        .then((response) => {
                          // Update the state after successful backend update
                          setProducts((prevProducts) =>
                            prevProducts.map((p) =>
                              p._id === product._id
                                ? { ...p, qty: p.qty + 1 }
                                : p
                            )
                          );
                        })
                        .catch((error) => {
                          console.error("Failed to update qty", error);
                        });
                    }}
                  >
                    <div className="text-center">
                      <p className="text-gray-800 font-semibold text-xl break-words">
                        +
                      </p>
                    </div>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  ₱{product.price * product.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-xl font-semibold text-gray-900 flex justify-end border-t shadow-md">
        Total: ₱
        {products.reduce(
          (acc, product) => acc + product.price * product.qty,
          0
        )}
      </div>
    </div>
  );
};

export default Reciept;
