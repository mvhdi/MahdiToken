// test for the MahdiTokenSale contract
// import the token sale
var MahdiTokenSale = artifacts.require("./MahdiTokenSale.sol");
// import the token
var MahdiToken= artifacts.require("./MahdiToken.sol");

//tests
contract('MahdiTokenSale', function(accounts) {
	var tokenSaleInstance;
	var buyer = accounts[1];

	var tokenPrice = 1000000000000000000 ;  // in wei subdivison of ether, equal to .001 eth
	var numberOfTokens;
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

	//test token buy function 
	it('faciliates token buying', function() {
		return MahdiTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			numberOfTokens = 10;
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
			// test to make sure Sell event is triggred
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'trigger one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
			return tokenSaleInstance.tokensSold();
			// tests that the number of tokes sold is incremented
		}).then(function(amount) {
			assert.equal(amount.toNumber(), numberOfTokens, 'increment the number of tokens sold ');
			// test for when you try to buy tokens different from the ether value, should prevent a rip off of underpaying or overpaying
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
		}) ;
	});







});
