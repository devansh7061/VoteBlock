pragma solidity >=0.6.0 <0.9.0;


// SPDX-License-Identifier: MIT

contract VotingContract {
    address owner;

    uint256 candidateCount = 0;

    uint256 voterCount = 0;

    bool start;

    string pollName;

    // Struct of a voter
    struct Voter {
        string name;
        string voterId; // Roll number or any other number
        address voterAddress; // Wallet address
        bool hasVoted;
    }

    mapping(address => Voter) private voterAddresses;

    // Struct of a candidate
    struct Candidate {
        uint256 candidateId;
        string name;
        string details; // manifesto or any other description
        uint256 voteCount; // the number of votes he got
    }

    mapping(uint => Candidate) private candidateDetails;

    uint [] private candidateVote;

    // Modifier for letting only the owner to add candidates
    modifier onlyOwner{
        require(msg.sender == owner, "only Owner");
        _;
    }   

    constructor(string memory _pollName) {
        owner = msg.sender;
        pollName = _pollName;
    }

    // function to add a new candidate
    function addCandidate(string memory _name, string memory _details)
        public
        onlyOwner
    {
        Candidate memory newCandidate = Candidate({
            candidateId: candidateCount,
            name: _name,
            details: _details,
            voteCount: 0
        });

        candidateDetails[candidateCount] = newCandidate;

        candidateCount += 1;
    }

    // function to add voter
    // only suitable for a local blockchain
    function manualAddVoter(
        string memory _name,
        string memory _voterId,
        address _voterAddress,
        bool _hasVoted
    ) public onlyOwner {
        Voter memory newVoter = Voter({
            name: _name,
            voterId: _voterId,
            voterAddress: _voterAddress,
            hasVoted: _hasVoted
        });

        voterAddresses[_voterAddress] = newVoter;

        voterCount += 1;
    }

    // actual function to add voters shouldbe done by an oracle
    // work on this later

    // the actual voting function
    function vote(uint256 _candidateId) public {
        require(voterAddresses[msg.sender].hasVoted == false);
        require(start == true);
        candidateDetails[_candidateId].voteCount += 1;
        voterAddresses[msg.sender].hasVoted = true;
    }

    // onlyOwner function for starting the election
    function startElection() public onlyOwner {
        start = true;
    }

    // onlyOwner function to end election
    function endEelection() public onlyOwner {
        start = false;
    }

    // public function to view election status (use this in dashboard)
    function electionStatus() public view returns (bool) {
        return (start);
    }
    uint winner=0;
    // function to view election results
    function electionResults() public onlyOwner returns (uint) {
        require(start == false);
        
        for(uint i=0; i<candidateCount; i++){
            candidateVote.push(candidateDetails[i].voteCount);
        }
        for(uint i=1; i<candidateCount; i++){
            if(candidateVote[i]>candidateVote[i-1]){
                winner=i;
            }
        }
        return winner;
        
        
    }
    function viewWinner() public view returns(string memory){
        return candidateDetails[winner].name;
    }

    // get total number of voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
}
}