
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Plus, Menu, X, Heart, User, XCircle, ChevronDown, Loader2 } from 'lucide-react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'

const categories = [
  { id: 'all', name: 'All', icon: '🏷️' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'property', name: 'Property', icon: '🏠' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'furniture', name: 'Furniture', icon: '🛋️' },
  { id: 'fashion', name: 'Fashion', icon: '👔' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'business', name: 'Business', icon: '🏪' },
  { id: 'jobs', name: 'Jobs', icon: '💼' },
  { id: 'services', name: 'Services', icon: '🔧' },
]

const cities = [
  { id: 'delhi', name: 'New Delhi', state: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab/Haryana' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { id: 'gurgaon', name: 'Gurgaon', state: 'Haryana' },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  { id: 'surat', name: 'Surat', state: 'Gujarat' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh' },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh' },
  { id: 'patna', name: 'Patna', state: 'Bihar' },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand' },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand' },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir' },
  { id: 'jammu', name: 'Jammu', state: 'Jammu & Kashmir' },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan' },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan' },
  { id: 'kota', name: 'Kota', state: 'Rajasthan' },
  { id: 'ajmer', name: 'Ajmer', state: 'Rajasthan' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { id: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh' },
  { id: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh' },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh' },
  { id: 'bhilai', name: 'Bhilai', state: 'Chhattisgarh' },
  { id: 'durg', name: 'Durg', state: 'Chhattisgarh' },
  { id: 'puducherry', name: 'Puducherry', state: 'Puducherry' },
  { id: 'mangalore', name: 'Mangalore', state: 'Karnataka' },
  { id: 'mysore', name: 'Mysore', state: 'Karnataka' },
  { id: 'hubli', name: 'Hubli', state: 'Karnataka' },
  { id: 'dharwad', name: 'Dharwad', state: 'Karnataka' },
  { id: 'bellary', name: 'Bellary', state: 'Karnataka' },
  { id: 'trivandrum', name: 'Trivandrum', state: 'Kerala' },
  { id: 'kochi', name: 'Kochi', state: 'Kerala' },
  { id: 'kozhikode', name: 'Kozhikode', state: 'Kerala' },
  { id: 'malappuram', name: 'Malappuram', state: 'Kerala' },
  { id: 'kannur', name: 'Kannur', state: 'Kerala' },
  { id: 'alappuzha', name: 'Alappuzha', state: 'Kerala' },
  { id: 'siliguri', name: 'Siliguri', state: 'West Bengal' },
  { id: 'durgapur', name: 'Durgapur', state: 'West Bengal' },
  { id: 'asansol', name: 'Asansol', state: 'West Bengal' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha' },
  { id: 'cuttack', name: 'Cuttack', state: 'Odisha' },
  { id: 'rourkela', name: 'Rourkela', state: 'Odisha' },
  { id: 'jamshedpur', name: 'Jamshedpur', state: 'Jharkhand' },
  { id: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand' },
  { id: 'bokaro', name: ' Bokaro', state: 'Jharkhand' },
  { id: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh' },
  { id: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh' },
  { id: 'ujjain', name: 'Ujjain', state: 'Madhya Pradesh' },
  { id: 'satna', name: 'Satna', state: 'Madhya Pradesh' },
  { id: 'mathura', name: 'Mathura', state: 'Uttar Pradesh' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh' },
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh' },
  { id: 'allahabad', name: 'Allahabad', state: 'Uttar Pradesh' },
  { id: 'meerut', name: 'Meerut', state: 'Uttar Pradesh' },
  { id: 'aligarh', name: 'Aligarh', state: 'Uttar Pradesh' },
  { id: 'moradabad', name: 'Moradabad', state: 'Uttar Pradesh' },
  { id: 'bareilly', name: 'Bareilly', state: 'Uttar Pradesh' },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh' },
  { id: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { id: 'faridabad', name: 'Faridabad', state: 'Haryana' },
  { id: 'panipat', name: 'Panipat', state: 'Haryana' },
  { id: 'karnal', name: 'Karnal', state: 'Haryana' },
  { id: 'rohtak', name: 'Rohtak', state: 'Haryana' },
  { id: 'sonipat', name: 'Sonipat', state: 'Haryana' },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab' },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab' },
  { id: 'jalandhar', name: 'Jalandhar', state: 'Punjab' },
  { id: 'patiala', name: 'Patiala', state: 'Punjab' },
  { id: 'bathinda', name: 'Bathinda', state: 'Punjab' },
  { id: 'jamnagar', name: 'Jamnagar', state: 'Gujarat' },
  { id: 'rajkot', name: 'Rajkot', state: 'Gujarat' },
  { id: 'bhavnagar', name: 'Bhavnagar', state: 'Gujarat' },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat' },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra' },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  { id: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra' },
  { id: 'solapur', name: 'Solapur', state: 'Maharashtra' },
  { id: 'kolhapur', name: 'Kolhapur', state: 'Maharashtra' },
  { id: 'latur', name: 'Latur', state: 'Maharashtra' },
  { id: 'dhule', name: 'Dhule', state: 'Maharashtra' },
  { id: 'akola', name: 'Akola', state: 'Maharashtra' },
  { id: 'nanded', name: 'Nanded', state: 'Maharashtra' },
  { id: 'sangli', name: 'Sangli', state: 'Maharashtra' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { id: 'salem', name: 'Salem', state: 'Tamil Nadu' },
  { id: 'tirunelveli', name: 'Tirunelveli', state: 'Tamil Nadu' },
  { id: 'vellore', name: 'Vellore', state: 'Tamil Nadu' },
  { id: 'dindigul', name: 'Dindigul', state: 'Tamil Nadu' },
  { id: 'thanjavur', name: 'Thanjavur', state: 'Tamil Nadu' },
  { id: 'nagapattinam', name: 'Nagapattinam', state: 'Tamil Nadu' },
  { id: 'kanyakumari', name: 'Kanyakumari', state: 'Tamil Nadu' },
  { id: 'anantapur', name: 'Anantapur', state: 'Andhra Pradesh' },
  { id: 'kurnool', name: 'Kurnool', state: 'Andhra Pradesh' },
  { id: 'kadapa', name: 'Kadapa', state: 'Andhra Pradesh' },
  { id: 'nellore', name: 'Nellore', state: 'Andhra Pradesh' },
  { id: 'warangal', name: 'Warangal', state: 'Telangana' },
  { id: 'karimnagar', name: 'Karimnagar', state: 'Telangana' },
  { id: 'khammam', name: 'Khammam', state: 'Telangana' },
  { id: 'ramagundam', name: 'Ramagundam', state: 'Telangana' },
  { id: 'secunderabad', name: 'Secunderabad', state: 'Telangana' },
]

// Login Modal Component
function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        const { data, error: registerError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name
            },
            emailRedirectTo: window.location.origin
          }
        })
        
        if (registerError) throw registerError
        
        if (data.user) {
          alert('Account created! Please check your email to confirm your account, then login.')
        }
        setIsRegister(false)
      } else {
        await login(formData.email, formData.password)
        onClose()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(26, 26, 46, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '90%',
        maxWidth: '440px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideUp 0.3s ease'
      }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <XCircle size={20} color="#6b7280" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '28px', 
            fontWeight: '700',
            color: '#1a1a2e',
            marginBottom: '8px'
          }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {isRegister ? 'Join PascalHub to start buying & selling' : 'Login to continue to PascalHub'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1a1a2e', fontSize: '14px' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.2s'
                }}
                required={isRegister}
              />
            </div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1a1a2e', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1a1a2e', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '14px', 
              background: '#fef2f2', 
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '14px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px 0 rgba(233, 69, 96, 0.3)'
            }}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {isRegister ? 'Create Account' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              style={{ 
                color: '#e94560', 
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isRegister ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

function Header() {
  const { user, logout, loading: authLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const [searchCategory, setSearchCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [citySelectorOpen, setCitySelectorOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem('pascalhub_city')
    return saved ? cities.find(c => c.id === saved) || cities[0] : cities[0]
  })
  const navigate = useNavigate()

  // Initialize category from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSearchCategory(category)
    }
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to home with search parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchCategory && searchCategory !== 'all') params.set('category', searchCategory)
    
    const queryString = params.toString()
    navigate(queryString ? `/?${queryString}` : '/')
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    localStorage.setItem('pascalhub_city', JSON.stringify(city.id))
    setCitySelectorOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            Pascal<span>Hub</span>
          </Link>

          <div 
            className="location-selector"
            onClick={() => setCitySelectorOpen(!citySelectorOpen)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <MapPin size={18} />
            <span>{selectedCity?.name || 'Select City'}</span>
            <ChevronDown size={16} />
            
            {citySelectorOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                maxHeight: '400px',
                overflow: 'auto',
                zIndex: 1000,
                marginTop: '12px'
              }}>
                {cities.map(city => (
                  <div
                    key={city.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCitySelect(city)
                    }}
                    style={{
                      padding: '14px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: selectedCity?.id === city.id ? '#fff5f6' : 'white',
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: selectedCity?.id === city.id ? '600' : '400', color: selectedCity?.id === city.id ? '#e94560' : '#1a1a2e' }}>{city.name}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{city.state}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form className="search-bar" onSubmit={handleSearch}>
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Search for cars, houses, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </form>

          <div className="header-actions">
            {authLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {user.user_metadata?.name?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '500', color: '#1a1a2e' }}>{user.user_metadata?.name || user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    background: 'white',
                    fontWeight: '500',
                    transition: 'all 0.3s'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className="login-btn" 
                onClick={() => setLoginOpen(true)}
                style={{ position: 'relative', zIndex: 1 }}
              >
                Login
              </button>
            )}
            <Link 
              to={user ? "/create" : "#"} 
              className="sell-btn"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault()
                  setLoginOpen(true)
                }
              }}
            >
              <Plus size={18} />
              <span>Sell</span>
            </Link>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)}
      />
    </>
  )
}

export default Header

