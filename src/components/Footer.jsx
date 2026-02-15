import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useState } from 'react'

const footerDescriptions = {
  'About Us': 'PascalHub is a leading online marketplace connecting buyers and sellers across the globe. Founded in 2026, we strive to make buying and selling as simple and secure as possible.',
  'Careers': 'Join our team and help shape the future of e-commerce. We are always looking for talented individuals who are passionate about creating great user experiences.',
  'Press': 'For media inquiries, please contact our press team at press@pascalhub.com. We welcome opportunities to share our story.',
  'Blog': 'Stay updated with the latest news, tips, and trends in online shopping and selling. Our blog features expert advice and community stories.',
  'Contact Us': 'Our support team is available 24/7 to help you. Email us at support@pascalhub.com or call +1 (555) 123-4567.',
  'Safety Tips': 'Always meet in public places, verify items before payment, and never share personal information. Your safety is our priority.',
  'Terms & Conditions': 'By using PascalHub, you agree to our terms. Users must be 18+ to buy or sell. All listings must comply with our community guidelines.',
  'Privacy Policy': 'We value your privacy. Your data is encrypted and never shared with third parties without consent. Learn more about how we protect your information.'
}

function Footer() {
  const [selectedInfo, setSelectedInfo] = useState(null)

  const handleLinkClick = (title) => {
    if (footerDescriptions[title]) {
      setSelectedInfo(title)
    }
  }

  const closeModal = () => {
    setSelectedInfo(null)
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Popular Categories</h3>
            <ul>
              <li><button className="footer-link" onClick={() => handleLinkClick('Cars')}>Cars</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Apartments')}>Apartments for Rent</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Jobs')}>Jobs</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Mobile Phones')}>Mobile Phones</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Trending Searches</h3>
            <ul>
              <li><button className="footer-link" onClick={() => handleLinkClick('Bikes')}>Bikes</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Watches')}>Watches</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Books')}>Books</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Dogs')}>Dogs</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>About Pascal Hub</h3>
            <ul>
              <li><button className="footer-link" onClick={() => handleLinkClick('About Us')}>About Us</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Careers')}>Careers</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Press')}>Press</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Blog')}>Blog</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Help & Support</h3>
            <ul>
              <li><button className="footer-link" onClick={() => handleLinkClick('Contact Us')}>Contact Us</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Safety Tips')}>Safety Tips</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Terms & Conditions')}>Terms & Conditions</button></li>
              <li><button className="footer-link" onClick={() => handleLinkClick('Privacy Policy')}>Privacy Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 PascalHub. All rights reserved.</p>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
        </div>
      </footer>

      {selectedInfo && (
        <div className="info-modal-overlay" onClick={closeModal}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="info-modal-close" onClick={closeModal}>×</button>
            <h2 className="info-modal-title">{selectedInfo}</h2>
            <p className="info-modal-description">{footerDescriptions[selectedInfo]}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Footer

