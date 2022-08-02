import React, { useEffect, useState, useContext } from "react";
import { TreasuryContext } from "../context/treasury.context";


const Treasury = () => {

  const {treasuryArray} = useContext(TreasuryContext);
  console.log(treasuryArray);

  return (
    <div>
      <div className="mx-auto" style={{ width: "500px" }}>
        <div className=" mt-10 text-2xl mx-auto  display: contents text-gray-50">
          <h1>
            {" "}
            <b> Treasury </b>
          </h1>
        </div>
        <div
          className=" mt-2 block p-6 m-2 mx-auto max-w-2xl rounded-lg border shadow-md hover:bg-gray-100"
          style={{ borderColor: "#2d2d2d" }}
        >
          <p className="font-normal text-gray-400 mx-auto max-w-2xl text-center"></p>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
