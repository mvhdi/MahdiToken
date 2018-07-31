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
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the inital supply to the admin account');
		});
	});
})