// version
pragma solidity ^0.4.2;

// declare contract
contract MahdiToken {

	//test to ensure it was created properly
	//set the number of tokens and read them back
	//constuctor
	
	uint256 public totalSupply; //declare the state variable, public variable so solidity
	// provides getter variable

	function MahdiToken() public {

		// state variable, writes to blockchain, 
		// name comes from rc20 standard and is a required function
		totalSupply = 1000000;

	}
}