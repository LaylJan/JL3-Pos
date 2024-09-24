import { useState } from "react";

const Reciept = ({}) => {
  return (
    <div className="p-2">
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse">
          <thead class="bg-white">
            <tr>
              <th
                scope="col"
                className=" px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase"
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
                class="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-900">
                Ice Cream
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                ₱20
              </td>
              <td class="flex items-center justify-center px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                <button className="bg-white border shadow-sm rounded-lg p-2 pt-1 w-[3rem] h-[2rem] hover:bg-gray-100 transition-all duration-200 ease-in-out break-words flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-800 font-semibold text-xl break-words">
                      -
                    </p>
                  </div>
                </button>
                <div className="m-1">1</div>
                <button className="bg-white border shadow-sm rounded-lg p-2 pt-1 w-[3rem] h-[2rem] hover:bg-gray-100 transition-all duration-200 ease-in-out break-words flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-800 font-semibold text-xl break-words">
                      +
                    </p>
                  </div>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                $20
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reciept;
