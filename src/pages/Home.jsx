
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories as defaultCategories } from '../data/mockData'
import { getAllAds } from '../utils/mongodb'
import AdCard from '../components/AdCard'
import FilterSidebar from '../components/FilterSidebar'
import { SlidersHorizontal, X } from 'lucide-react'

function Home() {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    location: 'all',
    condition: 'all'
  })

  // Initialize filters from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    
    if (query || category) {
      setFilters(prev => ({
        ...prev,
        search: query || '',
      }))
      if (category && category !== 'all') {
        setSelectedCategory(category)
      }
    }
  }, [searchParams])

  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = async () => {
    setLoading(true)
    try {
      const data = await getAllAds()
      setAds(data)
    } catch (err) {
      console.log('Error loading ads:', err)
    }
    setLoading(false)
  }

  // Calculate category counts dynamically from ads
  const categories = useMemo(() => {
    const counts = {}
    ads.forEach(ad => {
      counts[ad.category] = (counts[ad.category] || 0) + 1
    })
    
    return defaultCategories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? ads.length : (counts[cat.id] || 0)
    }))
  }, [ads])

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Apply all filters to ads
  const applyFilters = () => {
    let result = [...ads]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(ad => ad.category === selectedCategory)
    }
    
    // Filter by search keyword
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(ad => 
        (ad.title && ad.title.toLowerCase().includes(searchLower)) ||
        (ad.description && ad.description.toLowerCase().includes(searchLower))
      )
    }
    
    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(ad => ad.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter(ad => ad.price <= parseFloat(filters.maxPrice))
    }
    
    // Filter by location
    if (filters.location && filters.location !== 'all') {
      result = result.filter(ad => ad.location === filters.location)
    }
    
    // Filter by condition
    if (filters.condition && filters.condition !== 'all') {
      result = result.filter(ad => ad.condition === filters.condition)
    }
    
    // Sort ads
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      default:
        // Keep original order (newest first)
        break
    }
    
    return result
  }

  const resultAds = applyFilters()

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.location && filters.location !== 'all') count++
    if (filters.condition && filters.condition !== 'all') count++
    return count
  }, [filters])

  // Clear single filter
  const clearFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterKey === 'minPrice' || filterKey === 'maxPrice' ? '' : 
                   filterKey === 'location' || filterKey === 'condition' ? 'all' : ''
    }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      location: 'all',
      condition: 'all'
    })
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Great Deals Near You</h1>
          <p>Buy and sell items in your area on PascalHub</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div 
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.count} ads</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ads Section with Filters */}
      <section className="ads-section">
        <div className="container">
          <div className="ads-header">
            <h2 className="ads-count">
              {selectedCategory === 'all' 
                ? 'Latest Ads' 
                : `${categories.find(c => c.id === selectedCategory)?.name} (${resultAds.length})`
              }
            </h2>
            <div className="ads-header-actions">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-count-badge">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="active-filters">
              {filters.search && (
                <div className="filter-tag">
                  Search: "{filters.search}"
                  <button onClick={() => clearFilter('search')}><X size={14} /></button>
                </div>
              )}
              {filters.minPrice && (
                <div className="filter-tag">
                  Min: Rs. {parseInt(filters.minPrice).toLocaleString()}
                  <button onClick={() => clearFilter('minPrice')}><X size={14} /></button>
                </div>
              )}
              {filters.maxPrice && (
                <div className="filter-tag">
                  Max: Rs. {parseInt(filters.maxPrice).toLocaleString()}
                  <button onClick={() => clearFilter('maxPrice')}><X size={14} /></button>
                </div>
              )}
              {filters.location && filters.location !== 'all' && (
                <div className="filter-tag">
                  {filters.location}
                  <button onClick={() => clearFilter('location')}><X size={14} /></button>
                </div>
              )}
              {filters.condition && filters.condition !== 'all' && (
                <div className="filter-tag">
                  {filters.condition}
                  <button onClick={() => clearFilter('condition')}><X size={14} /></button>
                </div>
              )}
              <button className="clear-all-filters" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Mobile Filter Sidebar */}
          {showMobileFilters && (
            <div className="filter-modal-overlay" onClick={() => setShowMobileFilters(false)}>
              <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
                <FilterSidebar 
                  ads={ads} 
                  onFilterChange={handleFilterChange} 
                  onClose={() => setShowMobileFilters(false)}
                  isMobile={true}
                />
                <button 
                  className="filter-apply-btn"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Show {resultAds.length} Results
                </button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <p>Loading ads from MongoDB...</p>
            </div>
          ) : resultAds.length > 0 ? (
            <div className="ads-grid-with-sidebar">
              {/* Desktop Filter Sidebar */}
              <div className="desktop-filter-sidebar">
                <FilterSidebar 
                  ads={ads} 
                  onFilterChange={handleFilterChange} 
                />
              </div>
              
              <div className="ads-grid">
                {resultAds.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <h3>No ads found</h3>
              <p>Try adjusting your filters or search criteria</p>
              {activeFilterCount > 0 && (
                <button 
                  className="clear-all-filters" 
                  onClick={clearAllFilters}
                  style={{ marginTop: '16px' }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

