import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// MongoDB Connection String (from environment or use default)
// Replace with your MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your_connection_string_here'

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err))

// Create Ad Schema
const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  condition: { type: String, default: 'Used' },
  description: { type: String, required: true },
  location: { type: String, required: true },
  posted: { type: String, default: 'Just now' },
  images: [{ type: String }],
  seller: {
    name: String,
    memberSince: String,
    phone: String,
    userId: String
  },
  createdAt: { type: Date, default: Date.now }
})

const Ad = mongoose.model('Ad', adSchema)

// API Routes

// Get all ads
app.get('/api/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 })
    res.json(ads)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single ad by ID
app.get('/api/ads/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' })
    }
    res.json(ad)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create new ad
app.post('/api/ads', async (req, res) => {
  try {
    const newAd = new Ad(req.body)
    const savedAd = await newAd.save()
    res.status(201).json(savedAd)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete ad
app.delete('/api/ads/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id)
    res.json({ message: 'Ad deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get ads by category
app.get('/api/ads/category/:category', async (req, res) => {
  try {
    const ads = await Ad.find({ category: req.params.category }).sort({ createdAt: -1 })
    res.json(ads)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

