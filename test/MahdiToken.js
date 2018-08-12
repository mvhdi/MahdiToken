// testing

// import token
var MahdiToken = artifacts.require("./MahdiToken.sol"); 

// contract tests to ensure function in MahdiToken.sol work properly
contract('MahdiToken', function(accounts) {
// test token has correct identity
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
// test setting inital supply
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

//test transfer function, and triggering transfer event
	it('transfers token ownership', function() {
		return MahdiToken.deployed().then(function(instance) {
			tokenInstance = instance;
			// test 'require' statement by trying to transfer more than is in an account
			return tokenInstance.transfer.call(accounts[1], 99999999999999999); // doesn't create transaction
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >=0, 'error message must contain revert');
			//test boolean returned, without triggering actual transaction, just see what is returned.
			return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0]})  // doesn't create transaction
		}).then(function(success) {
			assert.equal(success, true, 'it returns true');
		
			return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
		}).then(function(receipt) {
			//creates transaction
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 250000, 'adds amount to the recieving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
		});
	});
// tests the approve function
	it('approves tokens for delegated transfer', function() {
		return MahdiToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.approve.call(accounts[1], 100);  // doesn't create transaction
		}).then(function(success) {
			assert.equal(success, true, 'it returns true');
			return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
		}).then(function(receipt) { 
			 // creates transaction
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
			assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
			return tokenInstance.allowance(accounts[0], accounts[1]);
		}).then(function(allowance) {
			assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
		});
	});
// tests the transferFrom function
	it('handles delegated token transfers', function() {
		return MahdiToken.deployed().then(function(instance) {
			tokenInstance = instance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];
			//transfer tokens  to fromAccount
			return tokenInstance.transfer(fromAccount, 100, { from: accounts[0]} );

		}).then(function(receipt) {
			// aprove spendingAccount to spend 10 tokens from fromAccount
			return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
		}).then(function(receipt) {
			// try transferring more thaninsender's balance
			return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount }); //creates transaction
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance' );
			// try transfer larger than approved amout
			return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount } ); //creates transaction
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount' );
			return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount }); // doesn't create a transaction
		}).then(function(success) {
			assert.equal(success, true);
			// test trigger event
			return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount }); //creates transaction
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
			// test if balance changed
			return tokenInstance.balanceOf(fromAccount);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 90, 'sending account has been deducted');
			return tokenInstance.balanceOf(toAccount);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 10, 'ammount added to recieving account');
		// update the allowance
		return tokenInstance.allowance(fromAccount, spendingAccount);
		}).then(function(allowance) {
			assert.equal(allowance.toNumber(), 0, 'deducted the amount from the allowance');
		});
	});
});