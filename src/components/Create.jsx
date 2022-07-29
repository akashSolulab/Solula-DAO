import React from "react";
import { createProposal, fetchProposalData, fundsInsideTreasury, fetchProposalLength } from "../utils/governace/governance-interaction";

export const Create = () => {

  return (
    <div>
      <button onClick={() => {createProposal()}}> Create Proposal </button>
    </div>
  );
};
