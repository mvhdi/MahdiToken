// version
pragma solidity ^0.4.2;

// declare contract
contract MahdiToken {
	//constuctor

	// Name
	string public name ="MahdiToken";

	// Symbol
	string public symbol ="MAHDI";

	//standard
	string public standard ="MahdiToken v1.0";

	
	uint256 public totalSupply; //declare the state variable, public variable so solidity
	// provides getter variable


	// declare public cariable that gives us a reader function 
	//declare a map, key is owner's address, with value being the account's balance 
	mapping(address => uint256) public balanceOf;



	function MahdiToken(uint256 _initalSupply) public {

		// Returns the account balance of an account with the given address
		// msg.sender is the sender of the message (current call)
		balanceOf[msg.sender] = _initalSupply;

		// set the number of inital coins
		totalSupply = _initalSupply;
		
	}
}