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
  const [proposalState, setProposalState] = useState(0);
  const [proposalStateString, setproposalStateString] = useState("");
  const [quorumState, setQuorumState] = useState(0);
  const [votesFor, setVotesFor] = useState(0);
  const [votesAgainst, setVotesAgainst] = useState(0);
  const [votesAbstain, setVotesAbstain] = useState(0);
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
    let timeRate = blockDifference * 15
    let timeOutput = (timeRate/60)
    let momentMin = moment().minute(timeOutput)
    return String(momentMin);
  }

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

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

    setTimeLeft(fetchTimeLeft())

  }, [proposalState, timeLeft]);

  useEffect(() => {
    provider.send("eth_requestAccounts", []).then(async () => {
      let signerObj = provider.getSigner();
      setSigner(await signerObj.getAddress());
    })
  })

  console.log(timeLeft);

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
  return (
    <div
      key={index}
      onClick={() => {
        toggleModal();
      }}
    >
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>
              <b> {data.description} </b>
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              perferendis suscipit officia recusandae, eveniet quaerat assumenda
              id fugit, dignissimos maxime non natus placeat illo iusto!
              Sapiente dolorum id maiores dolores? Illum pariatur possimus
              quaerat ipsum quos molestiae rem aspernatur dicta tenetur. Sunt
              placeat tempora vitae enim incidunt porro fuga ea.
            </p>
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
              Place your vote here
              <button
                className="vote-for"
                onClick={async () => {
                  await delegateGovernanceToken(
                    process.env.REACT_APP_ADMIN_ADDRESS
                  );
                  await castVoteAndParticipate(data.pId, 1);
                }}
              >
                For
              </button>{" "}
              ||
              <button
                onClick={async () => {
                  await delegateGovernanceToken(
                    process.env.REACT_APP_ADMIN_ADDRESS
                  );
                  await castVoteAndParticipate(data.pId, 0);
                }}
              >
                Against
              </button>{" "}
              ||
              <button
                onClick={async () => {
                  await delegateGovernanceToken(
                    process.env.REACT_APP_ADMIN_ADDRESS
                  );
                  await castVoteAndParticipate(data.pId, 2);
                }}
              >
                Abstain
              </button>{" "}
            </p>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
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
            <p className=" font-medium text-gray-400 ml-2">Add title here</p>
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
          Add content here
        </p>
        <p className="font-normal text-gray-400"> <b> End Time: {timeLeft} </b> </p>
      </a>
    </div>
  );
};

export default Card;
