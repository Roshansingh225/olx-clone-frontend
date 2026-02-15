
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, MapPin } from 'lucide-react'
import { categories } from '../data/mockData'
import { saveAd } from '../utils/mongodb'
import { useAuth } from '../context/AuthContext'

function CreateAd() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    location: '',
    name: '',
    phone: '',
    images: []
  })
  const [imagePreview, setImagePreview] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="create-ad">
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  // Pre-fill user info when user is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.name || prev.name,
        email: user.email,
        userId: user.id
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + imagePreview.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save to localStorage
      await saveAd({
        ...formData,
        images: imagePreview.length > 0 ? imagePreview : ['https://via.placeholder.com/400x300?text=No+Image']
      })
      alert('Ad posted successfully!')
      navigate('/')
    } catch (err) {
      console.error('Error posting ad:', err)
      alert('Error posting ad. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCategories = categories.filter(c => c.id !== 'all')

  return (
    <div className="create-ad">
      <div className="container">
        <h1>Post Your Ad</h1>
        
        <form className="create-ad-form" onSubmit={handleSubmit}>
          {/* Photos Section */}
          <div className="form-group">
            <label className="form-label">Photos (up to 5)</label>
            <div className="image-upload">
              <input 
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                <div className="image-upload-icon">
                  <Upload size={40} />
                </div>
                <div className="image-upload-text">
                  <strong>Add Photos</strong>
                  <p>Drag and drop or click to upload</p>
                </div>
              </label>
            </div>
            {imagePreview.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                {imagePreview.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={img} 
                      alt={`Preview ${index + 1}`}
                      style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#ff4757',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select 
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input 
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="What are you selling?"
              required
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price *</label>
            <input 
              type="number"
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price (0 for Contact for price)"
              min="0"
              required
            />
          </div>

          {/* Condition */}
          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select 
              name="condition"
              className="form-select"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea 
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail..."
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location *</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5F6F73' }} />
              <input 
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="form-group">
            <label className="form-label">Your Information</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input 
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
              <input 
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Ad'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateAd

