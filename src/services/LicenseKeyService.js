// src/services/LicenseKeyService.js
require("dotenv").config();
const web3 = require("../config/web3Config");
const LicenseKey = require("../models/LicenseKey");
const contractABI = [
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
];
// Provide your contract ABI here
const contractAddress = process.env.CONTRACT_ADDRESS; // Provide your contract address here
exports.createLicenseKey = async (walletAddress) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log("contract methods:", contract.methods);

  // Fetch NFT IDs using the walletOfOwner function
  const nftIds = await contract.methods.WalletOfOwner(walletAddress).call();
  console.log("nftIds", nftIds);

  if (nftIds.length === 0) {
    throw new Error("No NFTs found for this wallet.");
  }

  // Check if any entry exists with the same wallet address
  const existingEntry = await LicenseKey.findOne({ walletAddress });

  if (existingEntry) {
    throw new Error("License key already exists for this wallet address.");
  }

  // Use the first NFT ID found for this example
  const nftId = nftIds[0];

  const licenseKey = web3.utils.randomHex(16);
  const newLicenseKey = new LicenseKey({
    walletAddress,
    nftId,
    licenseKey,
  });

  await newLicenseKey.save();
  return newLicenseKey;
};

exports.registerOrLoginDevice = async (licenseKey, deviceId, deviceInfo) => {
  const license = await LicenseKey.findOne({ licenseKey });
  if (!license) {
    throw new Error("License key not found");
  }

  const device = license.devices.find((d) => d.deviceId === deviceId);
  if (device) {
    return {
      success: true,
      message: "Device already registered and login successful.",
    };
  }

  if (license.devices.length >= 3) {
    return {
      success: false,
      message: "License key registration limit reached.",
    };
  }

  license.devices.push({ deviceId, deviceInfo });
  await license.save();
  return { success: true, message: "Device registered and login successful." };
};
exports.getLicenseAndNFT = async (address) => {
  try {
    // Find license key owned by the address
    const licenseKey = await LicenseKey.findOne({ walletAddress: address });
    if (!licenseKey) {
      return null; // License key not found for the provided address
    }

    // Return the license key and NFT information
    return { licenseKey };
  } catch (error) {
    console.error("Error retrieving license key and NFT:", error);
    throw new Error("Internal server error");
  }
};

exports.updateLicenseKey = async (walletAddress) => {
  try {
    // Fetch the existing license key entry using the wallet address
    const existingLicense = await LicenseKey.findOne({ walletAddress });
    if (!existingLicense) {
      throw new Error("No existing license key found for this wallet address.");
    }

    // Generate a new license key
    const newLicenseKey = web3.utils.randomHex(16);

    // Log the old and new license keys for reference
    console.log(
      `Updating license key from ${existingLicense.licenseKey} to ${newLicenseKey}`
    );

    // Update the existing license key in the database
    existingLicense.licenseKey = newLicenseKey;
    await existingLicense.save();

    // Return the updated license key information
    return {
      success: true,
      message: "License key updated successfully.",
      newLicenseKey: existingLicense,
    };
  } catch (error) {
    console.error("Error updating license key:", error);
    throw new Error("Internal server error during license key update");
  }
};

exports.disconnectDevice = async (walletAddress, deviceId) => {
  try {
    // Fetch the license key entry using the wallet address
    const license = await LicenseKey.findOne({ walletAddress });
    if (!license) {
      throw new Error("License key not found.");
    }

    // Find and remove the device by deviceId
    const initialDeviceCount = license.devices.length;
    license.devices = license.devices.filter(
      (device) => device.deviceId !== deviceId
    );

    // Check if the device was successfully removed
    if (license.devices.length === initialDeviceCount) {
      throw new Error("Device not found or already disconnected.");
    }

    // Save the updated license entry
    await license.save();
    return { success: true, message: "Device disconnected successfully." };
  } catch (error) {
    console.error("Error disconnecting device:", error);
    throw error;
  }
};
