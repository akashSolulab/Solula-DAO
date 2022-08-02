const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Governance Flow", async () => {
  let TokenContract;
  let tokenContract;
  let TimelockContract;
  let timelockContract;
  let GovernanceContract;
  let governanceContract;
  let TreasuryContract;
  let treasuryContract;

  let provider;

  const treasuryABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_payee",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "isReleased",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "payee",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "releaseFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalFunds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  function waitForTx(ms) {
    return new Promise((res) => {
      setTimeout(res, ms);
    });
  }

  before(async () => {
    [owner, address1, address2, address3] = await ethers.getSigners();

    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // deploying token contract
    const tokenName = "Governance Token";
    const tokenSymbol = "GVNT";
    const initialSupply = ethers.utils.parseEther("100000");

    TokenContract = await ethers.getContractFactory("Token");
    tokenContract = await TokenContract.deploy(
      tokenName,
      tokenSymbol,
      initialSupply
    );
    console.log("deploying token contract...");
    tokenContract.deployed();
    console.log("token contract address:", tokenContract.address);

    // transfer some initial tokens to participants
    // this can be managed using a exchange to provide utility token
    const amountToTransferInParticipantWallet = ethers.utils.parseEther("100");
    await tokenContract.transfer(
      address1.address,
      amountToTransferInParticipantWallet
    );
    await tokenContract.transfer(
      address2.address,
      amountToTransferInParticipantWallet
    );
    await tokenContract.transfer(
      address3.address,
      amountToTransferInParticipantWallet
    );

    // deploying timelock contract
    const minDelay = 2; // How long do we have to wait until we can execute after a passed proposal (in block numbers)
    TimelockContract = await ethers.getContractFactory("TimeLock");
    timelockContract = await TimelockContract.deploy(
      minDelay,
      [owner.address],
      [owner.address]
    );
    console.log("Deploying timelock contract...");
    await timelockContract.deployed();
    console.log("Timelock contract address", timelockContract.address);

    // deploy governance contract
    const quorum = 3;
    const votingDelay = 0;
    const votingPeriod = 5;

    GovernanceContract = await ethers.getContractFactory("Governance");
    governanceContract = await GovernanceContract.deploy(
      tokenContract.address,
      timelockContract.address,
      quorum,
      votingDelay,
      votingPeriod
    );

    console.log("Deploying governance contract...");
    await governanceContract.deployed();
    console.log("Governance contract address:", governanceContract.address);

    // deploy treasury contract
    const funds = ethers.utils.parseEther("10");
    console.log("funds", funds);

    TreasuryContract = await ethers.getContractFactory("Treasury");
    treasuryContract = await TreasuryContract.deploy(owner.address, {
      value: funds,
    });
    console.log("Deploying treasury contract...");
    await treasuryContract.deployed();
    console.log("Treasury contract address:", treasuryContract.address);

    // transfer treasury ownership to executor
    let treasuryOwnership = await treasuryContract.transferOwnership(
      timelockContract.address
    );
    await treasuryOwnership.wait();

    // Assign roles
    const proposerRole = await timelockContract.PROPOSER_ROLE();
    const executorRole = await timelockContract.EXECUTOR_ROLE();

    await timelockContract.grantRole(proposerRole, governanceContract.address);
    await timelockContract.grantRole(executorRole, governanceContract.address);
  });

  describe("ERC20 Governance Token Data", () => {
    it("Token Name", async () => {
      expect(await tokenContract.name()).to.equal("Governance Token");
    });

    it("Token Symbol", async () => {
      expect(await tokenContract.symbol()).to.equal("GVNT");
    });
  });

  describe("Governance Contract Interaction", () => {
    let proposalId;
    before("Create Proposal", async () => {
      const iface = new ethers.utils.Interface(treasuryABI);
      // console.log(iface);
      const encodedFunction = iface.encodeFunctionData("releaseFunds");

      // description
      const description = "Release funds from treasury";

      let tx = await governanceContract.propose(
        [treasuryContract.address],
        [0],
        [encodedFunction],
        description
      );

      let txReceipt = await tx.wait(1);
      let id = await txReceipt.events[0].args.proposalId;
      proposalId = String(id)
    });

    it("Treasury should have funds", async () => {
      let funds = await provider.getBalance(treasuryContract.address);
      let parseFunds = ethers.utils.formatEther(String(funds));
      expect(parseFunds).to.equal("10.0");
    });

    it("should not release funds", async () => {
      let check = await treasuryContract.isReleased();
      let parseCheck = String(check);
      expect(parseCheck).to.equal("false");
    });

    it("should create proposal", async () => {
      let data = await governanceContract.proposals(1)
      let dataId = String(data.proposalId);
      expect(proposalId).to.equal(dataId);
    });

    it("should fetch quorum", async () => {
      let blockNumber = await provider.getBlockNumber();
      let quorum = await governanceContract.quorum(blockNumber - 1);
      let parseQuorum = ethers.utils.formatEther(String(quorum));
      expect(parseQuorum).to.equal("3000.0");
    })

    it("should caste vote", async () => {
      await governanceContract.connect(address1).castVote(proposalId, 1);
      await governanceContract.connect(address2).castVote(proposalId, 1);
      await governanceContract.connect(address3).castVote(proposalId, 1);

      let amount = ethers.utils.parseEther("1.0")
      // just to skip 1 block
      await tokenContract.transfer(address1.address, amount, { from: owner.address })
      await tokenContract.transfer(address1.address, amount, { from: owner.address })

      let proposalState = await governanceContract.state(proposalId);
      console.log(proposalState);

      const { againstVotes, forVotes, abstainVotes } = await governanceContract.proposalVotes(proposalId)
      console.log("For:", forVotes);
      console.log("Against", againstVotes);
      console.log("Abstain", abstainVotes);
    })
  });

  describe("Treasury Contract Interaction", () => {});
});
