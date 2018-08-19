// test for the MahdiTokenSale contract
// import the token sale
var MahdiTokenSale = artifacts.require("./MahdiTokenSale.sol");

//tests
contract('MahdiTokenSale', function(accounts) {
	var tokenSaleInstance;
	var tokenPrice = 1000000000000000000 ;  // in wei subdivison of ether, equal to .001 eth
// test to ensure correct initalization 
	it('initialze the contract with correct values', function() {
		return MahdiTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance.address
		}).then(function(address) {
			// tests address & MahditokenSale contract exists
			assert.notEqual(address, 0x0, 'has address');
			return tokenSaleInstance.tokenContract();
			//test toekn contract has been assigned
		}).then(function(address) {
			assert.notEqual(address, 0x0, 'has a token contracts address' );
			//  test the token price has been correctly set
			return tokenSaleInstance.tokenPrice();
		}).then(function(price) {
			assert.equal(price, tokenPrice, 'token price is correct')
		}) ;
	});
});
