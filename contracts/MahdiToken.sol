// Version
pragma solidity ^0.4.2;
// declares the  contract
//constuctor
contract MahdiToken {
	// Name
	string public name ="MahdiToken";
	// Symbol
	string public symbol ="MAHDI";
	//standard
	string public standard ="MahdiToken v1.0";

	//declare the state variable, public variable so solidity provides getter variable
	uint256 public totalSupply; 
	// transfer event
	event Transfer(
		address indexed _from, 
		address indexed _to, 
		uint256 _value
	);
	// approve event 
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);
	// declare public variable that gives us a reader function 
	//declare a map, key is owner's address, with value being the account's balance 
	mapping(address => uint256) public balanceOf;
	// allowance 
	mapping(address => mapping(address => uint256)) public allowance;
	function MahdiToken(uint256 _initalSupply) public {
		// Returns the account balance of an account with the given address
		// msg.sender is the sender of the message (current call)
		balanceOf[msg.sender] = _initalSupply;
		// set the number of inital coins
		totalSupply = _initalSupply;		
	}
	//transfer function
	function transfer(address _to, uint256  _value) public returns (bool success) {
	// trigger exception if the account balnce too low 
	require(balanceOf[msg.sender] >= _value);
	// Transfers MahdiToken  
	balanceOf[msg.sender] -= _value;
	balanceOf[_to] += _value;
	//trigger a Transfer event
	Transfer(msg.sender, _to, _value);
	// return a boolean if above code worked
	return true;
	}
	// approve function
	function approve(address _spender, uint256 _value) public returns (bool success) {
		// handles the allowance
		allowance[msg.sender][_spender] = _value;
		// approve event
		Approval(msg.sender, _spender, _value);
		return true;
	}
	// transferFrom function
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
		// require _from has enough tokens
		require(_value <= balanceOf[_from]);
		// require allowance is big enough
		require(_value <= allowance[_from][msg.sender]);
		// Change the balance
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		// update the allowance
		allowance[_from][msg.sender] -= _value;
		// Call Transfer event
		Transfer(_from, _to, _value);
		// return a boolean
		return true;
	}	
}