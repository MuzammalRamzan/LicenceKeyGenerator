const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    deviceInfo: { type: String, required: true }, // could include device name, type, etc.
  },
  { _id: false }
);

const LicenseKeySchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  nftId: { type: String, required: true },
  licenseKey: { type: String, required: true, unique: true },
  devices: [DeviceSchema],
});

module.exports = mongoose.model("LicenseKey", LicenseKeySchema);
