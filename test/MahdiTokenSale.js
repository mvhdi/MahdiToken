// test for the MahdiTokenSale contract
// import the token sale
var MahdiTokenSale = artifacts.require("./MahdiTokenSale.sol");
// import the token
var MahdiToken= artifacts.require("./MahdiToken.sol");

//tests
contract('MahdiTokenSale', function(accounts) {
	var tokenInstance;
	var tokenSaleInstance;
	var admin = accounts[0];
	var buyer = accounts[1];

	var tokenPrice = 1000000000000000000 ;  // in wei subdivison of ether, equal to .001 eth
	var tokensAvailable = 750000;
	var numberOfTokens;
// test to ensure correct initalization 
	it('initialze the contract with correct values', function() {
		return MahdiTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance.address
		}).then(function(address) {
			// tests address & MahdiTokenSale contract exists
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
		return MahdiToken.deployed().then(function(instance) {
			// grab token instance first
			tokenInstance = instance;
			return MahdiTokenSale.deployed();
		}).then(function(instance) {
			// the ngrab token sale instance
			tokenSaleInstance = instance;
			// provison 75% of all tokens to token sale
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin })
		}).then(function(receipt) {


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
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), numberOfTokens);
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
			// test for when you try to buy tokens different from the ether value, should prevent a rip off of underpaying or overpaying
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
			return tokenSaleInstance.buyTokens(800000, { from: buyer, value: 1 });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
		});
	});

// tests the endSale function
	it('end token sale', function() {
		return MahdiToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return MahdiTokenSale.deployed();

		}).then(function(instance) {
			tokenSaleInstance = instance;
			// try to end the sale from a non admin account
			return tokenSaleInstance.endSale({ from: buyer });

		}).then(assert.fail).catch(function(error) {

			assert(error.message.indexOf('revert' >=0, 'must be admin to end sale'));
			// end sale as admin
			return tokenSaleInstance.endSale({ from: admin });


		}).then(function(receipt) {
			return tokenInstance.balanceOf(admin);

		}).then(function(balance) {
			assert.equal(balance.toNumber(), 999990, 'returns all unsold MahdiTokens to admin');

			// Check that the contract has no balance
      		balance = web3.eth.getBalance(tokenSaleInstance.address)
      		assert.equal(balance.toNumber(), 0);

		}) ;
	});
});
