import { useState, useEffect } from "react";
import axios from "axios";

const Reciept = ({}) => {
  const [products, setProducts] = useState([]);
  const [payment, setPayment] = useState("");
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(null);

  useEffect(() => {
    // Calculate the total
    const totalAmount = products.reduce(
      (acc, product) => acc + product.price * product.qty,
      0
    );
    setTotal(totalAmount);

    // Calculate the change, only if payment is entered
    const numericPayment = parseFloat(payment) || 0;
    if (payment) {
      setChange(payment - totalAmount);
    } else {
      setChange(null); // Reset if no payment is entered
    }
  }, [products, payment]);

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
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-xl font-semibold text-gray-900 flex justify-between items-center border-t shadow-md">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="payment"
            className="block text-xl font-medium text-gray-700"
          >
            Payment:
          </label>
          <input
            type="number"
            id="payment"
            className="p-2 border rounded-md w-44 text-gray-700"
            placeholder="Enter payment"
            value={payment}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Only update the payment value with the input, or keep it an empty string when cleared
              setPayment(inputValue === "" ? "" : inputValue);
            }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <p>Total: ₱{total}</p>

          {/* Only show the change if payment is entered */}
          {change !== null && <p>Change: ₱{change}</p>}

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            onClick={() => console.log("Void transaction")}
          >
            Void
          </button>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
            onClick={() => console.log("End transaction")}
          >
            End Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reciept;
