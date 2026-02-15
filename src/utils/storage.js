
import { ads as initialAds } from '../data/mockData'

const STORAGE_KEY = 'olx_ads'

// Get ads from localStorage or use initial ads
const getStoredAds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAds))
    return initialAds
  } catch (err) {
    console.log('Error reading from localStorage:', err)
    return initialAds
  }
}

// Save ads to localStorage
const saveToStorage = (ads) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
  } catch (err) {
    console.log('Error saving to localStorage:', err)
  }
}

// Get all ads
export const getAds = async () => {
  return getStoredAds()
}

// Get single ad by ID
export const getAdById = async (id) => {
  const ads = getStoredAds()
  return ads.find(ad => ad.id === parseInt(id))
}

// Save new ad
export const saveAd = async (newAd) => {
  try {
    const ads = getStoredAds()
    
    // Generate new ID
    const newId = Math.max(...ads.map(a => a.id), 0) + 1
    
    const adData = {
      id: newId,
      title: newAd.title,
      price: parseFloat(newAd.price),
      category: newAd.category,
      condition: newAd.condition,
      description: newAd.description,
      location: newAd.location,
      posted: 'Just now',
      images: newAd.images || ['https://via.placeholder.com/400x300?text=No+Image'],
      seller: {
        name: newAd.name || 'Anonymous',
        memberSince: new Date().getFullYear().toString(),
        phone: newAd.phone || ''
      }
    }
    
    // Add new ad to the beginning
    const updatedAds = [adData, ...ads]
    saveToStorage(updatedAds)
    
    console.log('Ad saved successfully:', adData)
    return adData
  } catch (err) {
    console.log('Error saving ad:', err)
    throw err
  }
}

// Delete ad
export const deleteAd = async (id) => {
  try {
    const ads = getStoredAds()
    const updatedAds = ads.filter(ad => ad.id !== id)
    saveToStorage(updatedAds)
    return true
  } catch (err) {
    console.log('Error deleting ad:', err)
    throw err
  }
}

// Get ads by category
export const getAdsByCategory = async (category) => {
  const ads = getStoredAds()
  return ads.filter(ad => ad.category === category)
}

// Clear all ads (reset to initial)
export const clearAllAds = async () => {
  saveToStorage(initialAds)
  return initialAds
}

