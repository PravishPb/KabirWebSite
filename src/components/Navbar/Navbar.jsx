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
  const [satguruDropdownOpen, setSatguruDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [multimediaOpen, setMultimediaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMultimediaOpen, setMobileMultimediaOpen] = useState(false);
  const dropdownRef = useRef(null);
  const blogDropdownRef = useRef(null);
  const libraryDropdownRef = useRef(null);
  const satguruDropdownRef = useRef(null);
  const eventsDropdownRef = useRef(null);
  const contactDropdownRef = useRef(null);

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
        setMultimediaOpen(false);
      }
      if (satguruDropdownRef.current && !satguruDropdownRef.current.contains(e.target)) {
        setSatguruDropdownOpen(false);
      }
      if (eventsDropdownRef.current && !eventsDropdownRef.current.contains(e.target)) {
        setEventsDropdownOpen(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(e.target)) {
        setContactDropdownOpen(false);
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

          {/* Satguru Dropdown */}
          <div ref={satguruDropdownRef} className="relative">
            <button
              onClick={() => setSatguruDropdownOpen((v) => !v)}
              className="navbar-dropdown-btn"
              aria-expanded={satguruDropdownOpen}
              aria-haspopup="true"
            >
              {t.satguru || 'Satguru'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor" 
                className="navbar-dropdown-icon"
                style={{ transform: satguruDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {satguruDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="navbar-dropdown-menu left"
                >
                  <div style={{ padding: '0.5rem' }}>
                    <Link to="/satguru/jeevan-darshan" onClick={() => setSatguruDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.jeevanDarshan || 'Kabir Saheb Ke Jeevan Darshan'}
                    </Link>
                    <Link to="/library/pictorial-glimpses" onClick={() => setSatguruDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.pictorialGlimpses || 'Pictorial Glimpses'}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                    <Link to="/library/divya-drishti" onClick={() => { setLibraryDropdownOpen(false); setMultimediaOpen(false); }} className="navbar-dropdown-link">
                      {t.divyaDrishti || 'Divya Drishti'}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMultimediaOpen(!multimediaOpen);
                      }}
                      className="navbar-dropdown-link navbar-dropdown-btn-nested"
                      style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      aria-expanded={multimediaOpen}
                    >
                      <span>{t.multimedia || 'Multimedia'}</span>
                      <Icon 
                        name={multimediaOpen ? 'expand_less' : 'expand_more'} 
                        size={18} 
                        style={{ marginLeft: 'auto', opacity: 0.8 }}
                      />
                    </button>
                    <AnimatePresence>
                      {multimediaOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div>
                            <Link to="/library/holi-sammelan" onClick={() => { setLibraryDropdownOpen(false); setMultimediaOpen(false); }} className="navbar-dropdown-link sub-link">
                              {t.holiSammelan || 'Holi Sammelan'}
                            </Link>
                            <Link to="/library/kabir-night" onClick={() => { setLibraryDropdownOpen(false); setMultimediaOpen(false); }} className="navbar-dropdown-link sub-link">
                              {t.kabirNight || 'Kabir Night'}
                            </Link>
                            <Link to="/library/audio-video-files" onClick={() => { setLibraryDropdownOpen(false); setMultimediaOpen(false); }} className="navbar-dropdown-link sub-link">
                              {t.audioVideoFiles || 'Audio and Video Files'}
                            </Link>
                            <Link to="/library/religious-horizons" onClick={() => { setLibraryDropdownOpen(false); setMultimediaOpen(false); }} className="navbar-dropdown-link sub-link">
                              {t.religiousHorizons || 'Religious Horizons'}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events Dropdown */}
          <div ref={eventsDropdownRef} className="relative">
            <button
              onClick={() => setEventsDropdownOpen((v) => !v)}
              className="navbar-dropdown-btn"
              aria-expanded={eventsDropdownOpen}
              aria-haspopup="true"
            >
              {t.events || 'Events'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor" 
                className="navbar-dropdown-icon"
                style={{ transform: eventsDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {eventsDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="navbar-dropdown-menu left"
                >
                  <div style={{ padding: '0.5rem' }}>
                    <Link to="/events/chowka" onClick={() => setEventsDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.chowka || 'Chowka'}
                    </Link>
                    <Link to="/events/performances" onClick={() => setEventsDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.performances || 'Performances'}
                    </Link>
                    <Link to="/events/visits" onClick={() => setEventsDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.visits || 'Visits'}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact us Dropdown */}
          <div ref={contactDropdownRef} className="relative">
            <button
              onClick={() => setContactDropdownOpen((v) => !v)}
              className="navbar-dropdown-btn"
              aria-expanded={contactDropdownOpen}
              aria-haspopup="true"
            >
              {t.contactUs || 'Contact us'}
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor" 
                className="navbar-dropdown-icon"
                style={{ transform: contactDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {contactDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="navbar-dropdown-menu left"
                >
                  <div style={{ padding: '0.5rem' }}>
                    <Link to="/contact" onClick={() => setContactDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.contactInfo || 'Contact Information'}
                    </Link>
                    <Link to="/kabircenter" onClick={() => setContactDropdownOpen(false)} className="navbar-dropdown-link">
                      {t.kabirCenter || 'Kabir Center'}
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

              <div className="navbar-mobile-link" style={{ paddingBottom: '0.25rem' }}>{t.satguru || 'Satguru'}</div>
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                <Link to="/satguru/jeevan-darshan" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.jeevanDarshan || 'Kabir Saheb Ke Jeevan Darshan'}</Link>
                <Link to="/library/pictorial-glimpses" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.pictorialGlimpses || 'Pictorial Glimpses'}</Link>
              </div>
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
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMultimediaOpen(!mobileMultimediaOpen);
                  }}
                  className="navbar-mobile-link navbar-mobile-sublink navbar-mobile-btn-nested"
                  style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'inherit', textAlign: 'left', font: 'inherit', padding: '0.5rem' }}
                >
                  <span>{t.multimedia || 'Multimedia'}</span>
                  <Icon name={mobileMultimediaOpen ? 'expand_less' : 'expand_more'} size={18} style={{ opacity: 0.8 }} />
                </button>
                <AnimatePresence>
                  {mobileMultimediaOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column' }}
                    >
                      <Link to="/library/holi-sammelan" onClick={() => { setMobileOpen(false); setMobileMultimediaOpen(false); }} className="navbar-mobile-link navbar-mobile-sublink" style={{ fontSize: '0.85rem' }}>{t.holiSammelan || 'Holi Sammelan'}</Link>
                      <Link to="/library/kabir-night" onClick={() => { setMobileOpen(false); setMobileMultimediaOpen(false); }} className="navbar-mobile-link navbar-mobile-sublink" style={{ fontSize: '0.85rem' }}>{t.kabirNight || 'Kabir Night'}</Link>
                      <Link to="/library/audio-video-files" onClick={() => { setMobileOpen(false); setMobileMultimediaOpen(false); }} className="navbar-mobile-link navbar-mobile-sublink" style={{ fontSize: '0.85rem' }}>{t.audioVideoFiles || 'Audio and Video Files'}</Link>
                      <Link to="/library/religious-horizons" onClick={() => { setMobileOpen(false); setMobileMultimediaOpen(false); }} className="navbar-mobile-link navbar-mobile-sublink" style={{ fontSize: '0.85rem' }}>{t.religiousHorizons || 'Religious Horizons'}</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="navbar-mobile-link" style={{ paddingBottom: '0.25rem' }}>{t.events || 'Events'}</div>
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                <Link to="/events/chowka" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.chowka || 'Chowka'}</Link>
                <Link to="/events/performances" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.performances || 'Performances'}</Link>
                <Link to="/events/visits" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.visits || 'Visits'}</Link>
              </div>

              <div className="navbar-mobile-link" style={{ paddingBottom: '0.25rem' }}>{t.contactUs || 'Contact us'}</div>
              <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.contactInfo || 'Contact Information'}</Link>
                <Link to="/kabircenter" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-sublink">{t.kabirCenter || 'Kabir Center'}</Link>
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

