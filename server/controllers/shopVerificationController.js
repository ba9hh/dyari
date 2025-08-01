const ShopVerification = require('../models/ShopVerification');
const Shop = require('../models/Shop');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'zedtourheart@gmail.com', // Your email
    pass: 'kjqk ssnh ozdc ajsj',      // Your email password
  },
});
exports.createVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existing = await ShopVerification.findOne({ email });

    if (existing) {
      // Update existing verification code
      existing.verificationCode = verificationCode;
      await existing.save();
    } else {
      // Create new verification record
      const newVerification = new ShopVerification({ email, verificationCode });
      await newVerification.save();
    }

    const mailOptions = {
      from: 'zedtourheart@gmail.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Verification code generated/updated successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
exports.verifyAndDelete = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const entry = await ShopVerification.findOne({ email });

    if (!entry) {
      return res.status(404).json({ message: 'Verification entry not found.' });
    }

    if (entry.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Verified: delete the entry
    await ShopVerification.deleteOne({ email });

    res.status(200).json({ message: 'Email verified and entry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const exists = await Shop.exists({ email });
    return res.status(200).json({ exists: !!exists });

  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
exports.checkEmailExistsAndCreateVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const shopExists = await Shop.exists({ email });

    if (!shopExists) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Find existing verification or create new
    let verification = await ShopVerification.findOne({ email });

    if (verification) {
      verification.verificationCode = verificationCode;
      await verification.save();
    } else {
      verification = new ShopVerification({ email, verificationCode });
      await verification.save();
    }

    // Send email
    const mailOptions = {
      from: 'zedtourheart@gmail.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Verification code sent successfully.",
    });

  } catch (error) {
    console.error("Error generating verification code:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

