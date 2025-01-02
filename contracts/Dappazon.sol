// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    struct Item {
        uint256 id; 
        string name; 
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // List the products
    function list(
        uint256 _id, 
        string memory _name, 
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // Create the item struct
        Item memory item = Item(
            _id, _name, _category, _image, _cost, _rating, _stock
        );
        // Save the item to blockchain
        items[_id] = item;
        // Emit the list event
        emit List(_name, _cost, _stock);
    }

    // Buy the products
    function buy(uint256 _id) public payable {
        // Fetch the item
        Item memory item = items[_id];

        // Check whether the specified item is in stock
        require(item.stock > 0, "Specified item is out of stock");

        // Check whether enough ether is sent to buy the item
        require(msg.value >= item.cost, "Amount sent isn't sufficient to buy the specified product");

        // Create an order
        Order memory order = Order(block.timestamp, item);

        // Save order to chain
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        // Update the stock
        items[_id].stock = item.stock - 1;
        // Emit the Buy event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }
}