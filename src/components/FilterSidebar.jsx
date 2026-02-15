import { useState, useEffect } from 'react'
import { Search, MapPin, X, DollarSign, Filter, ChevronDown, ChevronUp } from 'lucide-react'

function FilterSidebar({ ads, onFilterChange, onClose, isMobile = false }) {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    location: 'all',
    condition: 'all'
  })
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: true,
    location: true,
    condition: true
  })

  // Get unique locations from ads
  const locations = [...new Set(ads.map(ad => ad.location).filter(Boolean))].sort()

  // Apply filters whenever they change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters])

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      location: 'all',
      condition: 'all'
    })
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const hasActiveFilters = filters.search || filters.minPrice || filters.maxPrice || filters.location !== 'all' || filters.condition !== 'all'

  return (
    <div className={`filter-sidebar ${isMobile ? 'filter-sidebar-mobile' : ''}`}>
      {isMobile && (
        <div className="filter-sidebar-header">
          <h3><Filter size={20} /> Filters</h3>
          <button onClick={onClose} className="filter-close-btn">
            <X size={24} />
          </button>
        </div>
      )}

      <div className="filter-content">
        {/* Search Keyword */}
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('search')}
          >
            <span><Search size={18} /> Search</span>
            {expandedSections.search ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.search && (
            <div className="filter-section-content">
              <input
                type="text"
                placeholder="Search in title & description..."
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                className="filter-input"
              />
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('price')}
          >
            <span><DollarSign size={18} /> Price Range</span>
            {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.price && (
            <div className="filter-section-content">
              <div className="price-inputs">
                <div className="price-input-group">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    className="filter-input"
                    min="0"
                  />
                </div>
                <span className="price-separator">to</span>
                <div className="price-input-group">
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    className="filter-input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('location')}
          >
            <span><MapPin size={18} /> Location</span>
            {expandedSections.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.location && (
            <div className="filter-section-content">
              <select
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('condition')}
          >
            <span><Filter size={18} /> Condition</span>
            {expandedSections.condition ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {expandedSections.condition && (
            <div className="filter-section-content">
              <div className="condition-options">
                <label className="condition-option">
                  <input
                    type="radio"
                    name="condition"
                    value="all"
                    checked={filters.condition === 'all'}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  />
                  <span>All</span>
                </label>
                <label className="condition-option">
                  <input
                    type="radio"
                    name="condition"
                    value="New"
                    checked={filters.condition === 'New'}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  />
                  <span>New</span>
                </label>
                <label className="condition-option">
                  <input
                    type="radio"
                    name="condition"
                    value="Used"
                    checked={filters.condition === 'Used'}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  />
                  <span>Used</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            <X size={16} /> Clear All Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterSidebar

