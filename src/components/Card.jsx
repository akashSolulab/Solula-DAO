import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./PopupStyles.css";
import {
  getProposalState,
  getQuorum,
  getVoteStatics,
  delegateGovernanceToken,
  castVoteAndParticipate,
} from "../utils/governace/governance-interaction.js";
import moment from "moment";

const Card = (props) => {
  const { data, index } = props;
  const [modal, setModal] = useState(false);
  const [proposalState, setProposalState] = useState();
  const [proposalStateString, setproposalStateString] = useState("");
  const [quorumState, setQuorumState] = useState();
  const [votesFor, setVotesFor] = useState();
  const [votesAgainst, setVotesAgainst] = useState();
  const [votesAbstain, setVotesAbstain] = useState();
  const [signer, setSigner] = useState();
  const [timeLeft, setTimeLeft] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const toggleModal = () => {
    setModal(!modal);
  };

  let fetchTimeLeft = () => {
    let endBlock = data.end;
    let startBlock = data.start;
    let blockDifference = endBlock - startBlock;
    let timeRate = blockDifference * 15;
    let timeOutput = timeRate / 60;
    let momentMin = moment.duration(timeOutput, "minutes").humanize();
    return String(momentMin);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  let proposalStateOutput = () => {
    // States:
    /**
     * 0 - Pending
     * 1 - Active
     * 2 - Canceled
     * 3 - Defeated
     * 4 - Succeeded
     * 5 - Queued
     * 6 - Expired
     * 7 - Executed
     */
    console.log("inside output:", proposalState);
    if (proposalState === 0) {
      return "Pending";
    } else if (proposalState === 1) {
      return "Active";
    } else if (proposalState === 2) {
      return "Canceled";
    } else if (proposalState === 3) {
      return "Defeated";
    } else if (proposalState === 4) {
      return "Succeeded";
    } else if (proposalState === 5) {
      return "Queued";
    } else if (proposalState === 6) {
      return "Expired";
    } else if (proposalState === 7) {
      return "Executed";
    } else {
      return "Yet to be triggered";
    }
  };

  useEffect(() => {
    getProposalState(data.pId).then((result) => {
      setProposalState(result);
      setproposalStateString(proposalStateOutput());
    });

    getQuorum().then((result) => {
      setQuorumState(result);
    });

    getVoteStatics(data.pId).then((result) => {
      setVotesFor(result.voteFor);
      setVotesAgainst(result.voteAgainst);
      setVotesAbstain(result.voteAbstain);
    });

    setTimeLeft(fetchTimeLeft());
  }, [
    proposalState,
    proposalStateString,
    timeLeft,
    votesFor,
    votesAgainst,
    votesAbstain,
  ]);

  useEffect(() => {
    provider.send("eth_requestAccounts", []).then(async () => {
      let signerObj = provider.getSigner();
      setSigner(await signerObj.getAddress());
    });
  });

  console.log(timeLeft);

  return (
    <div
      key={index}
      onClick={() => {
        toggleModal();
      }}
    >
      {modal && (
        <div className="modal justify-start ">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>
              <b> {data.description} </b>
            </h2>
            <p>
              Static Data Below. This can be replaced with a useful data <br />
              DAOs are an effective and safe way to work with like-minded folks
              around the globe.
            </p>
            <br />
            <hr />
            <p> Quorum: {quorumState} </p>
            <hr />
            <p>
              {" "}
              Voting Stats: Votes For = {votesFor} || Votes Against ={" "}
              {votesAgainst} || Votes Abstain = {votesAbstain}{" "}
            </p>
            <hr />
            <p>
              Place your vote here:
              <button
                className="rounded-full"
                onClick={async () => {
                  await delegateGovernanceToken();
                  await castVoteAndParticipate(data.pId, 1);
                }}
              >
                For
              </button>{" "}
              ||
              <button
                className="rounded-full"
                onClick={async () => {
                  await delegateGovernanceToken();
                  await castVoteAndParticipate(data.pId, 1);
                }}
              >
                Against
              </button>{" "}
              ||
              <button
                className="rounded-full"
                onClick={async () => {
                  await delegateGovernanceToken();
                  await castVoteAndParticipate(data.pId, 1);
                }}
              >
                Abstain
              </button>{" "}
            </p>
            <button className="close-modal" onClick={toggleModal}>
              <b>X</b>
            </button>
          </div>
        </div>
      )}
      <a
        href="#"
        className="block p-6 m-2 max-w-2xl    rounded-lg border shadow-md hover:bg-gray-700"
        style={{ borderColor: "#2d2d2d" }}
      >
        <div className="mb-3 flex flex-row justify-between">
          <div className="flex flex-row">
            <img
              src="https://mdbootstrap.com/img/new/standard/city/041.jpg"
              className=" h-6 w-6 rounded-full"
              alt=""
            />
            <p className=" font-medium text-gray-400 ml-2">Solulab DAO</p>
            <button className=" hover:bg-blue-700 text-gray-400 font-bold  px-1 rounded-full">
              Core
            </button>
          </div>

          <button className="bg-green-500 hover:bg-blue-700 text-white font-bold  px-3 rounded-full">
            {proposalStateString}
          </button>
        </div>
        <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white group-hover:text-gray-400">
          {data.description}
        </h5>
        <p className="font-normal text-gray-400">
          They have built-in treasuries that no one has the authority to access
          without the approval of the group. Decisions are governed by proposals
          and voting to ensure everyone in the organization has a voice.
        </p>
        <p className="font-normal text-gray-400">
          {" "}
          <b> Ends In: {timeLeft} </b>{" "}
        </p>
      </a>
    </div>
  );
};

export default Card;
