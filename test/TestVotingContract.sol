pragma solidity >=0.6.0 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./VotingContract.sol";

contract TestVoting {

  function testItStoresAValue() public {
    VotingContract votingContract = VotingContract(DeployedAddresses.Voting());

    voting.set(89);

    uint expected = 89;

    Assert.equal(voting.get(), expected, "It should store the value 89.");
  }

}
