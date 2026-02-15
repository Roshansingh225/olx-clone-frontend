// MongoDB Atlas connection string (for reference - not used directly in frontend)
// mongodb+srv://roushansinghlegend_db_user:<db_password>@cluster0.ieoctk9.mongodb.net/?appName=Cluster0

// MongoDB Atlas API base URL
const API_BASE_URL = 'http://localhost:3001/api'

// Get all ads from MongoDB
export const getAllAds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads`)
    if (!response.ok) throw new Error('Failed to fetch ads')
    const data = await response.json()
    
    // If MongoDB is empty, fall back to localStorage/mock data
    if (!data || data.length === 0) {
      console.log('MongoDB is empty, using localStorage fallback')
      return getStoredAds()
    }
    
    return data
  } catch (err) {
    console.log('Error fetching from MongoDB, using localStorage:', err)
    // Fallback to localStorage
    return getStoredAds()
  }
}

// Get single ad by ID
export const getAdById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads/${id}`)
    if (!response.ok) throw new Error('Failed to fetch ad')
    const adData = await response.json()
    
    // If MongoDB returns nothing, try localStorage
    if (!adData) {
      const ads = getStoredAds()
      return ads.find(ad => ad.id === parseInt(id) || ad._id === id)
    }
    
    return adData
  } catch (err) {
    console.log('Error fetching from MongoDB:', err)
    // Fallback to localStorage
    const ads = getStoredAds()
    return ads.find(ad => ad.id === parseInt(id) || ad._id === id)
  }
}

// Save new ad to MongoDB
export const saveAd = async (newAd) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAd)
    })
    
    if (!response.ok) throw new Error('Failed to save ad')
    
    const savedAd = await response.json()
    console.log('Ad saved to MongoDB:', savedAd)
    return savedAd

  } catch (err) {
    console.log('Error saving to MongoDB, using localStorage:', err)
    // Fallback to localStorage
    return saveAdToLocalStorage(newAd)
  }
}

// Delete ad from MongoDB
export const deleteAd = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete ad')
    return true
  } catch (err) {
    console.log('Error deleting from MongoDB:', err)
    // Fallback to localStorage
    const ads = getStoredAds()
    const updatedAds = ads.filter(ad => ad.id !== id)
    saveToStorage(updatedAds)
    return true
  }
}

// Get ads by category
export const getAdsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ads/category/${category}`)
    if (!response.ok) throw new Error('Failed to fetch ads')
    return await response.json()
  } catch (err) {
    console.log('Error fetching from MongoDB:', err)
    const ads = getStoredAds()
    return ads.filter(ad => ad.category === category)
  }
}

// LocalStorage fallback functions
import { ads as initialAds } from '../data/mockData'

const STORAGE_KEY = 'olx_ads'

const getStoredAds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAds))
    return initialAds
  } catch (err) {
    console.log('Error reading from localStorage:', err)
    return initialAds
  }
}

const saveToStorage = (ads) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
  } catch (err) {
    console.log('Error saving to localStorage:', err)
  }
}

const saveAdToLocalStorage = (newAd) => {
  try {
    const ads = getStoredAds()
    const newId = Math.max(...ads.map(a => a.id), 0) + 1
    
    const adData = {
      id: newId,
      title: newAd.title,
      price: parseFloat(newAd.price),
      category: newAd.category,
      condition: newAd.condition || 'Used',
      description: newAd.description,
      location: newAd.location,
      posted: 'Just now',
      images: newAd.images || ['https://via.placeholder.com/400x300?text=No+Image'],
      seller: {
        name: newAd.name || 'Anonymous',
        memberSince: new Date().getFullYear().toString(),
        phone: newAd.phone || ''
      },
      createdAt: new Date()
    }
    
    const updatedAds = [adData, ...ads]
    saveToStorage(updatedAds)
    
    console.log('Ad saved to localStorage:', adData)
    return adData
  } catch (err) {
    console.log('Error saving ad:', err)
    throw err
  }
}

// Connect to MongoDB (placeholder for direct connection)
export const connectToMongoDB = async () => {
  console.log('Using MongoDB API at http://localhost:3001')
  return null
}

export const closeConnection = async () => {
  console.log('Connection closed')
}

