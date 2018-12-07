
// artifacts allows us to interact with contract in any javascript enviorment
var MahdiToken = artifacts.require("./MahdiToken.sol");
var MahdiTokenSale = artifacts.require("./MahdiTokenSale.sol");

module.exports = function(deployer) {
	// the subsicent arguments after MahdiToken are passed into the constructor of MahdiToken.sol
  deployer.deploy(MahdiToken, 1000000).then(function() {
  	// token price is .001 eth
  	var tokenPrice = 1000000000000000;
  	 return deployer.deploy(MahdiTokenSale, MahdiToken.address, tokenPrice);
  });
};