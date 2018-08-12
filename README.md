# mahdi.token
Token cryptocurrency built upon the Ethereum blockchain, using an Ethereum smart contract following the [ERC20 Token Standard](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) 

[Examples of ERC20 tokens](https://eidoo.io/erc20-tokens-list/)

The complete ERC20 token is implemented in the file mahdi.token/contracts/MahdiToken.sol, and the tests for this token are in the file mahdi.token/test/MahdiToken.js . 

As required by the ERC20 standard this token has the functions:

function transfer(address _to, uint256  _value) public returns (bool success)

function approve(address _spender, uint256 _value) public returns (bool success)

function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
