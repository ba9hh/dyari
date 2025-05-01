const express = require('express');
const mongoose = require('mongoose');
const shopRoutes = require('./routes/shopRoutes');
const cors = require('cors');
const multer = require('multer');
const supabase = require('./supabaseClient');
const authController = require('./authController');
const authMiddleware = require('./authMiddleware')
const cookieParser = require('cookie-parser');
const Shop =require('./models/Shop')
const nodemailer = require('nodemailer');


const app = express()
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb+srv://ezdin:test123@karya.efcifes.mongodb.net/Shop?retryWrites=true&w=majority&appName=karya")
  .then(() => {
    console.log('App connected to database');

  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("App is listening to port: 3000");
});
app.get('/', (req, res) => {
  res.json(
    "Hello World"
  );
});
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use('/api', shopRoutes);
app.post('/api/login', authController.login);
app.get('/api/validateToken', authMiddleware,authController.validateToken);
app.post('/api/auth/google',authController.googleLogin);
app.post('/api/logout', authController.logout);

const upload = multer({ storage: multer.memoryStorage() });

app.get('/images', async (req, res) => {
  try {
    // List all files in the bucket
    const { data, error } = await supabase.storage.from('images').list('', {
      limit: 100,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'No images found' });
    }

    // Generate public URLs
    const filesWithUrls = data
      .filter((file) => file.name !== '.emptyFolderPlaceholder') // Ignore placeholders
      .map((file) => {
        const publicUrl = `${supabase.storageUrl}/object/public/images/${file.name}`;
        return { name: file.name, url: publicUrl };
      });

    res.status(200).json(filesWithUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { file } = req;
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images') // Replace with your bucket name
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Upload failed' });
    }

    // Get the public URL (if the bucket is public)
    const publicUrl = `${supabase.storageUrl}/object/public/images/${fileName}`;

    res.status(200).json({ message: 'File uploaded successfully', url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/:shopId/rate', authMiddleware, async (req, res) => {
  try {
    const { shopId } = req.params;
    const { rating } = req.body; // Expected rating value (1-5)

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Check if the logged in user has an accepted order for this shop
    const hasAcceptedOrder = req.user.orders.some(order =>
      order.shop.toString() === shopId && order.status === 'accepted'
    );

    if (!hasAcceptedOrder) {
      return res.status(403).json({ message: 'You must have an accepted order from this shop to rate it.' });
    }

    // Retrieve the shop
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Check if user has already rated the shop
    const existingRatingIndex = shop.ratings.findIndex(r => r.user.toString() === req.user._id.toString());

    if (existingRatingIndex > -1) {
      // Update existing rating
      shop.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      shop.ratings.push({ user: req.user._id, rating });
    }

    // Recalculate the average rating
    const total = shop.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    shop.averageRating = total / shop.ratings.length;

    await shop.save();

    res.status(200).json({ message: 'Rating submitted successfully.', shop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.post('/api/send-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Generate a random verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zedtourheart@gmail.com', // Your email
      pass: 'kjqk ssnh ozdc ajsj', // Your email password
    },
  });

  const mailOptions = {
    from: 'zedtourheart@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, code: verificationCode }); // Include the code in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});