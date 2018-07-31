
// artifacts allows us to interact with contract in any javascript enviorment
var MahdiToken = artifacts.require("./MahdiToken.sol");

module.exports = function(deployer) {
	// the subsicent arguments after MahdiToken are passed into the consturctor of MahdiToken
  deployer.deploy(MahdiToken, 1000000);
};