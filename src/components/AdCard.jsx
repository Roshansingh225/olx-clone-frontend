import { Heart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function AdCard({ ad }) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Handle both MongoDB (_id) and localStorage (id)
  const adId = ad._id || ad.id

  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const formatPrice = (price) => {
    if (price === 0) return 'Contact for price'
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <Link to={`/ad/${adId}`} className="ad-card">
      <div className="ad-image">
        <img 
          src={ad.images?.[0]} 
          alt={ad.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
          }}
        />
        <button 
          className={`ad-favorite ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          <Heart size={18} fill={isFavorite ? '#ff4757' : 'none'} />
        </button>
      </div>
      <div className="ad-info">
        <div className="ad-price">{formatPrice(ad.price)}</div>
        <div className="ad-title">{ad.title}</div>
        <div className="ad-meta">
          <span>{ad.location}</span>
          <span>{ad.posted}</span>
        </div>
      </div>
    </Link>
  )
}

export default AdCard

