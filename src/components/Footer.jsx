import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedFadeIn } from './ui';

const TEXT = {
  EN: {
    about: 'About',
    teachings: 'Teachings',
    blog: 'Blog',
    events: 'Events',
    library: 'Library',
    copyright: '© 2026 Kabir Association of Toronto',
    poweredBy: 'Powered by Saltbox',
    privacy: 'Privacy policy',
    terms: 'Terms of service',
    cookies: 'Cookie settings',
  },
  HI: {
    about: 'परिचय',
    teachings: 'शिक्षाएँ',
    blog: 'ब्लॉग',
    events: 'कार्यक्रम',
    library: 'पुस्तकालय',
    copyright: '© 2026 कबीर एसोसिएशन ऑफ़ टोरंटो',
    poweredBy: 'Saltbox द्वारा संचालित',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    cookies: 'कुकी सेटिंग्स',
  },
};

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
  },
  {
    name: 'Instagram',
    href: '#',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z',
  },
  {
    name: 'X',
    href: '#',
    path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z',
  },
  {
    name: 'LinkedIn',
    href: '#',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
  {
    name: 'YouTube',
    href: '#',
    path: 'M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z',
  },
];

const navLinks = [
  { key: 'about', to: '/about' },
  { key: 'teachings', to: '/teachings' },
  { key: 'blog', to: '/blog' },
  { key: 'events', to: '/events' },
  { key: 'library', to: '/library' },
];

export default function Footer({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <footer
      className="scheme-2"
      style={{
        background: 'var(--color-bg, #f5f0e8)',
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem 2rem',
      }}
    >
      <AnimatedFadeIn>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Top Area */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '2rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C12 2 8 6 8 10c0 2 1 3.5 2.5 4.2C10 15 9 16.5 7 18c0 0 3.5 1 5 4 1.5-3 5-4 5-4-2-1.5-3-3-3.5-3.8C15 13.5 16 12 16 10c0-4-4-8-4-8z"
                  fill="var(--color-accent, #d98204)"
                />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--color-text, #1b1e1c)',
                  letterSpacing: '0.08em',
                }}
              >
                Kabir Association
              </span>
            </div>

            {/* Nav Links */}
            <nav
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                alignItems: 'center',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  style={{
                    fontFamily: 'var(--font-body, sans-serif)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--color-text-muted, rgba(27,30,28,0.65))',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text, #1b1e1c)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted, rgba(27,30,28,0.65))')}
                >
                  {t[link.key]}
                </Link>
              ))}
            </nav>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(27,30,28,0.06)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(27,30,28,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(27,30,28,0.06)')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-text, #1b1e1c)">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'rgba(27,30,28,0.1)',
              marginBottom: '1.5rem',
            }}
          />

          {/* Bottom Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted, rgba(27,30,28,0.45))',
              }}
            >
              {t.copyright}
            </span>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                alignItems: 'center',
              }}
            >
              {[t.poweredBy, t.privacy, t.terms, t.cookies].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span
                      style={{
                        color: 'rgba(27,30,28,0.2)',
                        fontSize: '0.8rem',
                      }}
                    >
                      |
                    </span>
                  )}
                  <button
                    onClick={() => toast && toast(item)}
                    style={{
                      fontFamily: 'var(--font-body, sans-serif)',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted, rgba(27,30,28,0.45))',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text, #1b1e1c)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted, rgba(27,30,28,0.45))')}
                  >
                    {item}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </AnimatedFadeIn>
    </footer>
  );
}
