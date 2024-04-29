const cron = require("node-cron");
const web3 = require("./src/config/web3Config");
const LicenseKey = require("./src/models/LicenseKey");
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "WalletOfOwner",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // Your NFT contract ABI
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Your NFT contract address

const nftContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

// Schedule a task to run at a regular interval, e.g., every day at midnight
cron.schedule("* * * * *", async () => {
  console.log(
    "Running a daily check on all license keys to verify NFT ownership."
  );

  const licenses = await LicenseKey.find({});
  licenses.forEach(async (license) => {
    try {
      const nftIds = await nftContract.methods
        .WalletOfOwner(license.walletAddress)
        .call();

      // Check if the NFT ID associated with the license is still owned by the wallet
      if (!nftIds.includes(license.nftId)) {
        // If the NFT is no longer in the wallet, delete the license key from the database
        await LicenseKey.findByIdAndDelete(license._id);
        console.log(
          `License key and data deleted for wallet ${license.walletAddress} as NFT ID ${license.nftId} is no longer owned.`
        );
      }
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
    }
  });
});
