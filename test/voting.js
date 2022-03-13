const VotingContract = artifacts.require("./VotingContract.sol");

contract("VotingContract", accounts => {
  it("...should store the value 89.", async () => {
    const votingContractInstance = await VotingContract.deployed();

    // Set value of 89
    await votingContractInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await votingContractInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
