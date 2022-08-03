import React, { useState, useContext } from "react";
import { TreasuryContext } from "../context/treasury.context";
import {
  createProposal,
  queueGovernance,
  executeGovernance,
} from "../utils/governace/governance-interaction";

export const Create = () => {
  const [treasuryAddress, setTreasuryAddress] = useState("");
  const [description, setDescription] = useState("");

  const { updateTreasuryArray, treasuryArray } = useContext(TreasuryContext);

  console.log(treasuryArray);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Treasury Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="treasuryAddress"
              type="text"
              placeholder="Ex: 0x1E...95Ed"
              value={treasuryAddress}
              onChange={(e) => setTreasuryAddress(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Description
            </label>
            <input
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Ex: release funds"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <button
              type="button"
              className="text-black bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={async () => {
                await createProposal(treasuryAddress, description);
                updateTreasuryArray(treasuryAddress);
                console.log(treasuryArray);
              }}
            >
              <small>Create</small>
            </button>
            <button
              type="button"
              className="text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900"
              onClick={async () => {
                await queueGovernance(treasuryAddress, description);
                updateTreasuryArray(treasuryAddress);
                console.log(treasuryArray);
              }}
            >
              <small>Queue</small>
            </button>
            <button
              type="button"
              className="text-black bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={async () => {
                await executeGovernance(treasuryAddress, description);
                updateTreasuryArray(treasuryAddress);
                console.log(treasuryArray);
              }}
            >
              <small>Execute</small>
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">&copy;2022 Solulab DAO</p>
      </div>
    </div>
  );
};
