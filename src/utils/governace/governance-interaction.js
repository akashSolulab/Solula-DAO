import { ethers } from 'ethers';
import Token from "../../contracts/Token.json"
import Governance from "../../contracts/Governance.json";
import TimeLock from "../../contracts/TimeLock.json";
import Treasury from "../../contracts/Treasury.json";

// provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// fetching contract adderesses
const tokenContract = process.env.REACT_APP_TOKEN_CONTRACT;
const timelockContract = process.env.REACT_APP_TIMELOCK_CONTRACT;
const governanceContract = process.env.REACT_APP_GOVERNANCE_CONTRACT;
const treasuryContract = process.env.REACT_APP_TREASURY_CONTRACT;

// fetching contract ABIs
const tokenABI = Token.abi
const treasuryABI = Treasury.abi
const governanceABI = Governance.abi
const timelockABI = TimeLock.abi

// Initiating contract instance:
const tokenContractInstance = new ethers.Contract(tokenContract, tokenABI, provider);
const timelockContractInstnce = new ethers.Contract(timelockContract, timelockABI, provider);
const governanceContractInstance = new ethers.Contract(governanceContract, governanceABI, provider);
const treasuryContractInstance = new ethers.Contract(treasuryContract, treasuryABI, provider)

// signer
// initiating signerObj, signer and proposalId
let signer;
let signerObj;

// Getting signer from provider:
const getSigner = async () => {
    await provider.send("eth_requestAccounts", [])
    signerObj = provider.getSigner()
    signer = await signerObj.getAddress()
}

const iface = new ethers.utils.Interface(Treasury.abi);
// console.log(iface);
const encodedFunction = iface.encodeFunctionData("releaseFunds");
// console.log("encoded function", encodedFunction);
const description = "Release Fund From Treasurya";

export const createProposal = async () => {
    console.log(signerObj);
    console.log(signer);
    await getSigner();
    let tx = await governanceContractInstance.connect(signerObj).propose([treasuryContract], [0], [encodedFunction], description);
    let txReceipt = await tx.wait(1);
    console.log(txReceipt);
    let id = await txReceipt.events[0].args.proposalId;
    console.log(String(id));
}


