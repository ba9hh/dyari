const express = require('express');
const mongoose = require('mongoose');
const shopRoutes = require('./routes/shopRoutes');
const articleRoutes = require('./routes/articleRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const shopAdditionalInfoRoutes = require('./routes/shopAdditionalInfoRoutes');
const shopVerificationRoutes = require('./routes/shopVerificationRoutes');
const authRoutes =require('./authRoutes');
const cors = require('cors');
const multer = require('multer');
const supabase = require('./supabaseClient');
const authMiddleware = require('./authMiddleware')
const cookieParser = require('cookie-parser');
const Shop =require('./models/Shop')
const nodemailer = require('nodemailer');


const app = express()
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb+srv://ezdin:test123@karya.efcifes.mongodb.net/dyari?retryWrites=true&w=majority&appName=karya")
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
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use('/api', shopRoutes);
app.use('/api', articleRoutes);
app.use('/api', orderRoutes);
app.use('/api', ratingRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', shopAdditionalInfoRoutes);
app.use('/api', shopVerificationRoutes);

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
    console.log(file);
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
app.delete('/delete', async (req, res) => {
  try {
    const { fileUrl } = req.body;

    // Extract the path inside the bucket
    const filePath = fileUrl.split('/object/public/')[1]; // e.g. 'images/1728492100000-myphoto.jpg'

    const { data, error } = await supabase.storage
      .from('images') // still your bucket
      .remove([filePath.replace('images/', '')]); // if you upload directly into images, remove the folder prefix

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Deletion failed' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
