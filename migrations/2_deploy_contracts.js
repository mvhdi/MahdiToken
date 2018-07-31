
// artifacts allows us to interact with contract in any javascript enviorment
var MahdiToken = artifacts.require("./MahdiToken.sol");

module.exports = function(deployer) {
  deployer.deploy(MahdiToken);
};