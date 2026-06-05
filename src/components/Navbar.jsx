import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Icon } from './ui';

const TEXT = {
  EN: {
    about: 'About',
    teachings: 'Teachings',
    blog: 'Blog',
    more: 'More',
    events: 'Events',
    eventsDesc: 'Upcoming gatherings and celebrations',
    library: 'Library',
    libraryDesc: 'Sacred texts, recordings, and resources',
    contact: 'Contact',
    contactDesc: 'Reach out to our community',
    donate: 'Donate',
    donateDesc: 'Support our mission with a contribution',
    dropdownFooter: 'Join us for weekly satsang',
    dropdownCta: 'Plan your visit',
  },
  HI: {
    about: 'परिचय',
    teachings: 'शिक्षाएँ',
    blog: 'ब्लॉग',
    more: 'और',
    events: 'कार्यक्रम',
    eventsDesc: 'आगामी सभाएँ और उत्सव',
    library: 'पुस्तकालय',
    libraryDesc: 'पवित्र ग्रंथ, रिकॉर्डिंग और संसाधन',
    contact: 'संपर्क',
    contactDesc: 'हमारे समुदाय से जुड़ें',
    donate: 'दान',
    donateDesc: 'अपने योगदान से हमारे मिशन का समर्थन करें',
    dropdownFooter: 'साप्ताहिक सत्संग के लिए हमसे जुड़ें',
    dropdownCta: 'अपनी यात्रा की योजना बनाएं',
  },
};

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

export default function Navbar({ lang = 'EN', setLang, toast }) {
  const t = TEXT[lang] || TEXT.EN;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="scheme-6"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--color-bg, #1b1e1c)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

          <img
            src="/logo-minimal.svg"
            alt="Kabir Association"
            width="40"
            height="40"
            style={{ opacity: 0.85 }}
          />

        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="navbar-desktop-links"
        >
          <Link to="/about" style={navLinkStyle}>{t.about}</Link>
          <Link to="/teachings" style={navLinkStyle}>{t.teachings}</Link>
          <Link to="/blog" style={navLinkStyle}>{t.blog}</Link>

          {/* More Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                ...navLinkStyle,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: 0,
              }}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {t.more}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
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
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    background: 'var(--color-bg, #1b1e1c)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    minWidth: 300,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '0.5rem' }}>
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.key}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem 1rem',
                          borderRadius: 8,
                          textDecoration: 'none',
                          color: 'var(--color-text, #f5f0e8)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ fontSize: '1.25rem', opacity: 0.6, display: 'flex' }}>
                          <Icon name={item.icon} />
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t[item.key]}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: 2 }}>{t[`${item.key}Desc`]}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', opacity: 0.5, color: 'var(--color-text, #f5f0e8)' }}>{t.dropdownFooter}</span>
                    <Link
                      to="/events"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--color-accent, #d98204)',
                        textDecoration: 'none',
                      }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Toggle */}
          <div
            style={{
              display: 'flex',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <button
              onClick={() => setLang && setLang('EN')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                background: lang === 'EN' ? 'var(--color-accent, #d98204)' : 'transparent',
                color: lang === 'EN' ? '#fff' : 'var(--color-text-muted, rgba(245,240,232,0.5))',
                transition: 'all 0.2s',
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang && setLang('HI')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                background: lang === 'HI' ? 'var(--color-accent, #d98204)' : 'transparent',
                color: lang === 'HI' ? '#fff' : 'var(--color-text-muted, rgba(245,240,232,0.5))',
                transition: 'all 0.2s',
              }}
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
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--color-text, #f5f0e8)',
            }}
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
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'var(--color-bg, #1b1e1c)',
            }}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Link to="/about" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>{t.about}</Link>
              <Link to="/teachings" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>{t.teachings}</Link>
              <Link to="/blog" onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>{t.blog}</Link>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' }} />
              {dropdownItems.map((item) => (
                <Link key={item.key} to={item.to} onClick={() => setMobileOpen(false)} style={mobileLinkStyle}>
                  <span style={{ opacity: 0.5, marginRight: '0.75rem', display: 'flex', alignItems: 'center', fontSize: '1.25rem' }}><Icon name={item.icon} /></span>
                  {t[item.key]}
                </Link>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, color: 'var(--color-text, #f5f0e8)' }}>{t.dropdownFooter}</span>
                <Link
                  to="/events"
                  onClick={() => setMobileOpen(false)}
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent, #d98204)', textDecoration: 'none' }}
                >
                  {t.dropdownCta} →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-burger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

const navLinkStyle = {
  fontFamily: 'var(--font-body, sans-serif)',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'var(--color-text, #f5f0e8)',
  textDecoration: 'none',
  letterSpacing: '0.02em',
  transition: 'opacity 0.2s',
  opacity: 0.85,
};

const mobileLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 0.5rem',
  fontSize: '1rem',
  fontWeight: 500,
  color: 'var(--color-text, #f5f0e8)',
  textDecoration: 'none',
  borderRadius: 8,
  transition: 'background 0.15s',
};
