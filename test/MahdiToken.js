// testing

// import token
var MahdiToken = artifacts.require("./MahdiToken.sol"); 

//initalize, function gives the accounts availabe
contract('MahdiToken', function(accounts) {

	it('upon deployment set the total supply',function() {
		return MahdiToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000000, 'sets supply to 1,000,000');
		});
	});
})