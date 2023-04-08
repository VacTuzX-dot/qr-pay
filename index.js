const express = require("express");
const app = express();
const QRCode = require("qrcode");
const generatePayload = require("promptpay-qr");
const bodyParser = require("body-parser");
const _ = require("lodash");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log("server is running........");
});

app.post("/generateQR", (req, res) => {
  const amount = parseFloat(_.get(req, ["body", "amount"]));
  const mobileNumber = _.get(req, ["body", "mobileNumber"]); // อ่านค่าเบอร์โทรจาก req.body
  // เช็คว่า mobileNumber ไม่เป็นค่าว่างหรือไม่
  if (!mobileNumber) {
    return res.status(400).json({ error: "Mobile number is required." });
  }
  const payload = generatePayload(mobileNumber, { amount });
  const option = {
    color: {
      dark: "#000",
      light: "#fff",
    },
  };
  QRCode.toDataURL(payload, option, (err, url) => {
    if (err) {
      return res.status(500).json({ error: "Failed to generate QR code." });
    }
    return res.status(200).json({ Result: url });
  });
});

module.exports = app;
