import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Icon } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './Navbar.css';

const dropdownItems = [
  { key: 'events', icon: 'event', to: '/events' },
  { key: 'library', icon: 'menu_book', to: '/library' },
  { key: 'contact', icon: 'mail', to: '/contact' },
  { key: 'donate', icon: 'favorite', to: '/donate' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15, ease: 'easeIn' } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export default function Navbar() {
  const { lang, setLang } = useApp();
  const t = useTranslation('Navbar');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const blogDropdownRef = useRef(null);
  const libraryDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (blogDropdownRef.current && !blogDropdownRef.current.contains(e.target)) {
        setBlogDropdownOpen(false);
      }
      if (libraryDropdownRef.current && !libraryDropdownRef.current.contains(e.target)) {
        setLibraryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="scheme-6 navbar-wrapper">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo-link">
          <img
            src="/logo-minimal.svg"
            alt="Kabir Association"
            width="40"
            height="40"
            className="navbar-logo-img"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-desktop-links">
          <Link to="/" className="navbar-link">{t.home}</Link>
          <Link to="/about" className="navbar-link">{t.about}</Link>
          <Link to="/teachings" className="navbar-link">{t.teachings}</Link>
          
          {/* Blog Dropdown */}
          <div ref={blogDropdownRef} className="relative">
            <button
              onClick={() => setBlogDropdownOpen((v) => !v)}
              className="navbar-dropdown-btn"
              aria-expanded={blogDropdownOpen}
              aria-haspopup="true"
            >
              {t.blog}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor" 
                className="navbar-dropdown-icon"
                style={{ transform: blogDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {blogDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="navbar-dropdown-menu left"
                >
                  <div style={{ padding: '0.5rem' }}>
                    <Link to="/blog" onClick={() => setBlogDropdownOpen(false)} className="navbar-dropdown-link">
                      All Blogs
                    </Link>
                    <Link to="/blog?filter=KAOT" onClick={() => setBlogDropdownOpen(false)} className="navbar-dropdown-link">
                      Blog (KAOT)
                    </Link>
                    <Link to="/blog?filter=Dr.+J+Das" onClick={() => setBlogDropdownOpen(false)} className="navbar-dropdown-link">
                      Blog (Dr. J Das)
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/library/sakhis" className="navbar-link">{t.sakhis || 'Sakhis'}</Link>

          {/* Library Dropdown */}
          <div ref={libraryDropdownRef} className="relative">
            <button
              onClick={() => setLibraryDropdownOpen((v) => !v)}
              className="navbar-dropdown-btn"
              aria-expanded={libraryDropdownOpen}
              aria-haspopup="true"
            >
              {t.library || 'Library'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor" 
                className="navbar-dropdown-icon"
                style={{ transform: libraryDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {libraryDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="navbar-dropdown-menu left"
                >
                  <div style={{ padding: '0.5rem' }}>
                    <Link to="/library/bhajans" onClick={() => setLibraryDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.bhajans || 'Bhajans'}
                    </Link>
                    <Link to="/library/prayers" onClick={() => setLibraryDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.prayers || 'Prayers and Devotional Hymns'}
                    </Link>
                    <Link to="/library/dr-j-das" onClick={() => setLibraryDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.drJDas || 'Dr. J. Das'}
                    </Link>
                    <Link to="/library/divya-drishti" onClick={() => setLibraryDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.divyaDrishti || 'Divya Drishti'}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="navbar-dropdown-btn"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {t.more}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor" 
                className="navbar-dropdown-icon"
                style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="navbar-dropdown-menu right"
                >
                  <div style={{ padding: '0.5rem' }}>
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.key}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className="navbar-dropdown-link-complex"
                      >
                        <span className="navbar-dropdown-icon-wrapper">
                          <Icon name={item.icon} />
                        </span>
                        <div>
                          <div className="navbar-dropdown-title">{t[item.key]}</div>
                          <div className="navbar-dropdown-desc">{t[`${item.key}Desc`]}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="navbar-dropdown-footer">
                    <span className="navbar-dropdown-footer-text">{t.dropdownFooter}</span>
                    <Link
                      to="/events"
                      onClick={() => setDropdownOpen(false)}
                      className="navbar-dropdown-footer-link"
                    >
                      {t.dropdownCta} →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side: Lang toggle + Mobile burger */}
        <div className="navbar-right-controls">
          {/* Language Toggle */}
          <div className="navbar-lang-toggle">
            <button
              onClick={() => setLang && setLang('EN')}
              className={`navbar-lang-btn ${lang === 'EN' ? 'active' : 'inactive'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang && setLang('HI')}
              className={`navbar-lang-btn ${lang === 'HI' ? 'active' : 'inactive'}`}
            >
              HI
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            className="navbar-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar-mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="navbar-mobile-container">
              <Link to="/" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">{t.home}</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">{t.about}</Link>
              <Link to="/teachings" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">{t.teachings}</Link>
              
              <div className="navbar-mobile-link" style={{ paddingBottom: '0.25rem' }}>{t.blog}</div>
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                <Link to="/blog" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">All Blogs</Link>
                <Link to="/blog?filter=KAOT" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">Blog (KAOT)</Link>
                <Link to="/blog?filter=Dr.+J+Das" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">Blog (Dr. J Das)</Link>
              </div>

              <Link to="/library/sakhis" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">{t.sakhis || 'Sakhis'}</Link>

              <div className="navbar-mobile-link" style={{ paddingBottom: '0.25rem' }}>{t.library || 'Library'}</div>
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                <Link to="/library/bhajans" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.bhajans || 'Bhajans'}</Link>
                <Link to="/library/prayers" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.prayers || 'Prayers and Devotional Hymns'}</Link>
                <Link to="/library/dr-j-das" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.drJDas || 'Dr. J. Das'}</Link>
                <Link to="/library/divya-drishti" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.divyaDrishti || 'Divya Drishti'}</Link>
              </div>

              <div className="navbar-mobile-divider" />
              {dropdownItems.map((item) => (
                <Link key={item.key} to={item.to} onClick={() => setMobileOpen(false)} className="navbar-mobile-link">
                  <span className="navbar-mobile-icon"><Icon name={item.icon} /></span>
                  {t[item.key]}
                </Link>
              ))}
              <div className="navbar-mobile-divider" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem 0' }}>
                <span className="navbar-dropdown-footer-text">{t.dropdownFooter}</span>
                <Link
                  to="/events"
                  onClick={() => setMobileOpen(false)}
                  className="navbar-dropdown-footer-link"
                >
                  {t.dropdownCta} →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

