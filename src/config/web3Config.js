require("dotenv").config();
const { Web3 } = require("web3");

// Example RPC URL; replace it with your actual BSC testnet RPC URL
const RPC_URL = process.env.RPC_URL;

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

module.exports = web3;
