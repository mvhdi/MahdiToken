// testing

// import token
var MahdiToken = artifacts.require("./MahdiToken.sol"); 

//initalize, function gives the accounts availabe
contract('MahdiToken', function(accounts) {

	it('initalizes the contract with the correct values', function() {
		return MahdiToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'MahdiToken', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'MAHDI', 'has the correct symbol')
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, "MahdiToken v1.0", 'has the correct standard');

		});
	})

	it('upon deployment allocates the inital supply',function() {
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