pragma solidity >=0.4.25 <0.6.0;

contract ERC20Basic {

    string public constant name = "ERC20Basic";
    string public constant symbol = "BSC";
    uint8 public constant decimals = 18;  


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;

    using SafeMath for uint256;

    constructor(uint256 total) public {  
	    totalSupply_ = total;
	    balances[msg.sender] = totalSupply_;

        clique[0x627306090abaB3A6e1400e9345bC60c78a8BEf57] = true;
        clique[0xf17f52151EbEF6C7334FAD080c5704D77216b732] = true;
        clique[0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef] = true;
        clique[0x821aEa9a577a9b44299B9c15c88cf3087F3b5544] = true;
        clique[0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2] = true;
    }  

    function totalSupply() public view returns (uint256) {
	    return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    mapping (address => bool) clique;

    function onlyClique(address guy) public {
        if (!clique[guy]) {
            revert("Not part of clique");
        }
    }
    

    function transfer(address receiver, uint numTokens) public returns (bool) {
        onlyClique(receiver);

        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}