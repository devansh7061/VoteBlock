import React, { useState, useEffect } from "react";
import VotingContract from "./contracts/VotingContract.json";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import Navbar from "./Navbar";
import NavbarAdmin from "./NavbarAdmin";
import { FormGroup, FormControl, Button } from "react-bootstrap";
let Contract;

const biconomy = new Biconomy(window.ethereum,{apiKey: "vFmhM91EO.e142c093-1206-4b8f-93f6-b17c9cd10a2c"});
let domainData = {
  name: "Vote",
  version: "1",
  chainId: "4", // Rinkeby
  verifyingContract: "0x9Cc85758aD7Ce8b706021CABA07300e1ff9114Ea",
};
const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
];
const contractAddress = "0x9Cc85758aD7Ce8b706021CABA07300e1ff9114Ea";
const contractAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidateDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "details",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voterAddresses",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "voterId",
        type: "string",
      },
      {
        internalType: "address",
        name: "voterAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "hasVoted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_details",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_voterId",
        type: "string",
      },
      {
        internalType: "address",
        name: "_voterAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_hasVoted",
        type: "bool",
      },
    ],
    name: "manualAddVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endEelection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "electionStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "electionResults",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "viewWinner",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getVoterCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getCandidateCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
let web3;

function Vote() {
  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        // Modern DApp browsers
        web3 = new Web3(biconomy);
        biconomy.onEvent(biconomy.READY, async () => {
            // Initialize your dapp here like getting user accounts etc
            await window.ethereum.enable();
            let contract = new web3.eth.Contract(contractAbi, contractAddress);
            startApp();
          }).onEvent(biconomy.ERROR, (error, message) => {
            // Handle error while initializing mexa
            console.log(error)
          });
        try {
          await window.ethereum.enable();
          this.setState({
            VotingInstance: instance,
            web3: web3,
            account: accounts[0],
          });
    
          let myAccount = await this.state.VotingInstance.methods.voterAddresses(
            this.state.accounts
          );
          this.setState({ myAccount: myAccount });
    
          let candidateCount = await this.state.VotingInstance.methods
            .getCandidateCount()
            .call();
    
          let candidateList = [];
          for (let i = 0; i < candidateCount; i++) {
            let candidate = await this.state.VotingInstance.methods
              .candidateDetails(i)
              .call();
            candidateList.push(candidate);
          }
          this.setState({ candidateLists: candidateList });
    
          let start = await this.state.VotingInstance.methods
            .electionStatus()
            .call();
    
          this.setState({ start: start });
    
          const owner = await this.state.VotingInstance.methods.getOwner().call();
          if (this.state.account === owner) {
            this.setState({ isOwner: true });
          }
        } catch (error) {
          // User denied account access
          console.log(error);
        }
      } else if (window.web3) {
        // Legacy dapp browsers
        web3 = new Web3(window.web3.currentProvider);
      } else {
        // Non-dapp browsers
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    })();
  }, []);
  state = {
    web3: null,
    accounts: null,
    contract: null,
    isOwner: false,
    start: false,
    myAccount: null,
    candidateId: "",
    candidateLists: null,
  };
  updateCandidateId = (event) => {
    this.setState({ candidateId: event.target.value });
  };

  async function startApp() {
    myContract = new web3.eth.Contract(contractAbi, contractAddress);
    // Get quote from blockchain on app start
    vote();
  }
  async function vote() {
    await this.state.VotingInstance.methods
      .vote(this.state.candidateId)
      .send({ from: this.state.account });
    window.location.reload(false);
  }
  async function voteMeta() {
    console.log(window.ethereum.selectedAddress)
    console.log(contract)
    let nonce = await contract.methods.nonces(window.ethereum.selectedAddress).call();
    let message = {};
    message.nonce = parseInt(nonce);
    message.from = window.ethereum.selectedAddress;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message
    });

    window.web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [window.ethereum.selectedAddress, dataToSign]
      },
      async function (err, result) {
        if (err) {
          return console.error(err);
        }
        console.log("Signature result from wallet :");
        console.log(result);
        if(result && result.result) {
          const signature = result.result.substring(2);
          const r = "0x" + signature.substring(0, 64);
          const s = "0x" + signature.substring(64, 128);
          const v = parseInt(signature.substring(128, 130), 16);
          console.log(r, "r")
          console.log(s, "s")
          console.log(v, "v")
          console.log(window.ethereum.address, "userAddress")
  
          const promiEvent = contract.methods
            .voteMeta(window.ethereum.selectedAddress, newQuote, r, s, v)
            .send({
              from: window.ethereum.selectedAddress
            })
          promiEvent.on("transactionHash", (hash) => {
            showInfoMessage("Transaction sent successfully. Check Console for Transaction hash")
            console.log("Transaction Hash is ", hash)
          }).once("confirmation", (confirmationNumber, receipt) => {
            if (receipt.status) {
              showSuccessMessage("Transaction processed successfully")
              startApp()
            } else {
              showErrorMessage("Transaction Failed");
            }
            console.log(receipt)
          })
        } else {
          showErrorMessage("Could not get user signature. Check console logs for error");
        }
      }
    );


  render()
  {
    let candidateList;
    if (this.state.candidateLists) {
      candidateList = this.state.candidateLists.map(
        (candidate, candidateId) => {
          return (
            <div className="candidate" key={candidateId}>
              <div className="candidateName">{candidate.name}</div>
              <div className="candidateDetails">
                <div>Details : {candidate.details}</div>
                <div>Candidate ID : {candidate.candidateId}</div>
              </div>
              <br></br>
            </div>
          );
        }
      );
    }

    if (!this.state.web3) {
      return (
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>Loading Web3, accounts, and contract..</h1>
          </div>
          {this.state.isOwner ? <NavbarAdmin /> : <Navbar />}
        </div>
      );
    }

    if (!this.state.start) {
      return (
        <div className="CandidateDetails">
          {this.state.isOwner ? <NavbarAdmin /> : <Navbar />}
          <div className="CandidateDetails-title">
            <h1>VOTING HAS NOT STARTED YET.</h1>
          </div>

          <div className="CandidateDetails-sub-title">
            Please Wait.....While election starts !
          </div>
        </div>
      );
    }

    // if (this.state.myAccount) {
    //   if (!this.state.myAccount.isVerified) {
    //     return (
    //       <div className="CandidateDetails">
    //         <div className="CandidateDetails-title">
    //           <h1>You need to verified first for voting.</h1>
    //         </div>

    //         <div className="CandidateDetails-sub-title">
    //           Please wait....the verification can take time
    //         </div>
    //         {this.state.isOwner ? <NavbarAdmin /> : <Navbar />}
    //       </div>
    //     );
    //   }
    // }

    if (this.state.myAccount) {
      if (this.state.myAccount.hasVoted) {
        return (
          <div className="CandidateDetails">
            <div className="CandidateDetails-title">
              <h1>YOU HAVE SUCCESSFULLY CASTED YOUR VOTE</h1>
            </div>
            {this.state.isOwner ? <NavbarAdmin /> : <Navbar />}
          </div>
        );
      }
    }

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        {this.state.isOwner ? <NavbarAdmin /> : <Navbar />}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>VOTE</h1>
          </div>
        </div>

        <div className="form">
          <FormGroup>
            <div className="form-label">
              Enter Candidate ID you want to vote{" "}
            </div>
            <div className="form-input">
              <FormControl
                input="text"
                value={this.state.candidateId}
                onChange={this.updateCandidateId}
              />
            </div>

            <Button onClick={this.vote} className="button-vote">
              Vote
            </Button>
          </FormGroup>
        </div>

        {/* <Button onClick={this.getCandidates}>
              Get Name
            </Button> */}

        {this.state.toggle ? (
          <div>You can only vote to your own constituency</div>
        ) : (
          ""
        )}

        <div className="PollResult">Candidates from your Constituency</div>

        <div>{candidateList}</div>
      </div>
    );
  }
}
}

export default Vote;
