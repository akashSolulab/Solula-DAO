import React, { useState, useContext } from "react";
import { TreasuryContext } from "../context/treasury.context";
import { createProposal } from "../utils/governace/governance-interaction";

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
      <form>
        <label className="font-normal text-gray-400">
          Enter treasury address
          <input
            type="text"
            value={treasuryAddress}
            onChange={(e) => setTreasuryAddress(e.target.value)}
          />
        </label>
        <label className="font-normal text-gray-400">
          Enter description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </form>
      <br />
      <div>
        <button
          className="bg-red-500 hover:bg-blue-700 text-white font-bold  px-3 rounded-full py-2"
          onClick={async () => {
            await createProposal(treasuryAddress, description);
            updateTreasuryArray(treasuryAddress);
            console.log(treasuryArray);
          }}
        >
          Create Proposal
        </button>
      </div>
    </div>
  );
};
