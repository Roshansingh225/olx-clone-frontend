
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, Phone, MessageCircle, User, ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react'
import { categories } from '../data/mockData'
import { getAdById, getAllAds } from '../utils/mongodb'
import AdCard from '../components/AdCard'

function AdDetail() {
  const { id } = useParams()
  const [ad, setAd] = useState(null)
  const [similarAds, setSimilarAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    loadAd()
  }, [id])

  const loadAd = async () => {
    setLoading(true)
    try {
      const adData = await getAdById(id)
      setAd(adData)
      
      // Load similar ads
      if (adData) {
      const allAds = await getAllAds()
        const similar = allAds
          .filter(a => a.category === adData.category && a.id !== adData.id)
          .slice(0, 4)
        setSimilarAds(similar)
      }
    } catch (err) {
      console.log('Error loading ad:', err)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="ad-detail">
        <div className="container" style={{ textAlign: 'center', padding: '100px 16px' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="ad-detail">
        <div className="container" style={{ textAlign: 'center', padding: '100px 16px' }}>
          <h2>Ad not found</h2>
          <p>The ad you're looking for doesn't exist.</p>
          <Link to="/" style={{ color: '#002F34', textDecoration: 'underline' }}>
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  const category = categories.find(c => c.id === ad.category)
  const adImages = ad.images || ['https://via.placeholder.com/800x500?text=No+Image']

  const formatPrice = (price) => {
    if (price === 0) return 'Contact for price'
    return `Rs. ${price?.toLocaleString() || 0}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % adImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + adImages.length) % adImages.length)
  }

  const sellerInfo = ad.seller || { name: 'Unknown', memberSince: '2024', phone: 'N/A' }
  
  // Ensure phone is always available
  const displayPhone = sellerInfo.phone || 'N/A'

  return (
    <div className="ad-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#5F6F73' }}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/?category=${ad.category}`}>{category?.name}</Link>
          <span>/</span>
          <span style={{ color: '#002F34' }}>{(ad.title || '').substring(0, 40)}...</span>
        </div>

        <div className="ad-detail-grid">
          {/* Left Column - Images */}
          <div className="ad-gallery">
            <div style={{ position: 'relative' }}>
              <img 
                src={adImages[currentImageIndex]} 
                alt={ad.title}
                className="main-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'
                }}
              />
              {adImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'white',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'white',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            <div className="thumbnail-list">
              {adImages.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x80?text=No+Image'
                  }}
                />
              ))}
            </div>

            {/* Description */}
            <div className="description-section">
              <h2 className="description-title">Description</h2>
              <p className="description-text">{ad.description}</p>
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="ad-info-panel">
            <div className="ad-info-price">{formatPrice(ad.price)}</div>
            <h1 className="ad-info-title">{ad.title}</h1>
            
            <div className="ad-info-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} />
                {ad.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {ad.posted}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #DFE4E5',
                  borderRadius: '4px',
                  background: isFavorite ? '#fff0f1' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: isFavorite ? '#ff4757' : '#5F6F73'
                }}
              >
                <Heart size={18} fill={isFavorite ? '#ff4757' : 'none'} />
                Save
              </button>
              <button 
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #DFE4E5',
                  borderRadius: '4px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#5F6F73'
                }}
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            <div className="seller-card">
              <div className="seller-title">Seller Description</div>
              <div className="seller-info">
                <div className="seller-avatar">
                  <User size={24} />
                </div>
                <div>
                  <div className="seller-name">{sellerInfo.name}</div>
                  <div style={{ fontSize: '12px', color: '#5F6F73' }}>
                    Member since {sellerInfo.memberSince}
                  </div>
                </div>
              </div>
            </div>

            <button className="contact-btn">
              <Phone size={18} style={{ marginRight: '8px' }} />
              {displayPhone}
            </button>
            
            <button className="contact-btn" style={{ background: '#002F34', color: 'white' }}>
              <MessageCircle size={18} style={{ marginRight: '8px' }} />
              Chat with Seller
            </button>
          </div>
        </div>

        {/* Similar Ads */}
        {similarAds.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 className="section-title">Similar Ads</h2>
            <div className="ads-grid">
              {similarAds.map(similarAd => (
                <AdCard key={similarAd.id} ad={similarAd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdDetail

