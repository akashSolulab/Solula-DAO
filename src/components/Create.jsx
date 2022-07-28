import React from "react";
import { createProposal, fetchProposalData, fundsInsideTreasury, fetchProposalLength } from "../utils/governace/governance-interaction";

export const Create = () => {
  console.log(fundsInsideTreasury());
  console.log(fetchProposalData());
  console.log(fetchProposalLength());
  return (
    <div>
      <button onClick={() => {createProposal()}}> Create Proposal </button>
    </div>
  );
};
