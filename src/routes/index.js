const express = require("express");
const router = express.Router();
const LicenseKeyController = require("../controllers/LicenseKeyController");

// Route to generate a new license key for a wallet address
router.post("/license-keys", LicenseKeyController.generateLicenseKey);

// Route for device login using a license key
router.post("/device-login", LicenseKeyController.deviceLogin);

// Route to retrieve license key and associated NFT information
router.post("/getLicenseAndNFT", LicenseKeyController.getLicenseAndNFT);

// New route to update a compromised license key
router.put("/reset-license-key", LicenseKeyController.updateLicenseKey);

router.post("/disconnect-device", LicenseKeyController.disconnectDevice);

module.exports = router;
