// src/controllers/LicenseKeyController.js
const LicenseKeyService = require("../services/LicenseKeyService");

exports.generateLicenseKey = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const licenseKey = await LicenseKeyService.createLicenseKey(walletAddress);
    res.status(201).json({ success: true, licenseKey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deviceLogin = async (req, res) => {
  try {
    const { licenseKey, deviceId, deviceInfo } = req.body;
    const result = await LicenseKeyService.registerOrLoginDevice(
      licenseKey,
      deviceId,
      deviceInfo
    );
    res.status(result.success ? 200 : 403).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLicenseAndNFT = async (req, res) => {
  try {
    let { walletAddress } = req.body;
    walletAddress = walletAddress.toLowerCase(); // Convert to lowercase
    const result = await LicenseKeyService.getLicenseAndNFT(walletAddress);
    if (!result) {
      return res
        .status(404)
        .json({ message: "License key not found for the provided address." });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving license key and NFT:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateLicenseKey = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required." });
    }

    const updatedLicense = await LicenseKeyService.updateLicenseKey(
      walletAddress
    );
    res.status(200).json(updatedLicense);
  } catch (error) {
    console.error("Error updating license key:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.disconnectDevice = async (req, res) => {
  try {
    const { walletAddress, deviceId } = req.body;
    if (!walletAddress || !deviceId) {
      return res
        .status(400)
        .json({ message: "Wallet address and device ID are required." });
    }

    const result = await LicenseKeyService.disconnectDevice(
      walletAddress,
      deviceId
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in device disconnection:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
