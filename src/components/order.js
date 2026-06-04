const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-order", async (req, res) => {
  const data = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourmail@gmail.com",
      pass: "gmail-app-password",
    },
  });

  await transporter.sendMail({
    from: "yourmail@gmail.com",
    to: "yourmail@gmail.com",
    subject: "New Candle Order",
    html: `
      <h2>Shipping Details</h2>
      <p>Name: ${data.firstName} ${data.lastName}</p>
      <p>Email: ${data.email}</p>
      <p>Phone: ${data.phone}</p>
      <p>Address: ${data.address}</p>
      <p>City: ${data.city}</p>
      <p>State: ${data.state}</p>
      <p>Pincode: ${data.pincode}</p>
    `,
  });

  res.json({ success: true });
});

module.exports = router;