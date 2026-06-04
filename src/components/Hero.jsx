import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui';

function PlaceholderImg({ className = '', style = {}, alt = '', gradient = 'linear-gradient(135deg, #1b1e1c 0%, #563401 50%, #d98204 100%)' }) {
  return <div className={className} style={{ ...style, background: gradient, width: '100%' }} role="img" aria-label={alt} />;
}

const TEXT = {
  EN: {
    kicker: 'Kabir Association of Toronto',
    h1: 'A quiet place for the teachings of Kabir',
    cta: 'Step into stillness',
    scrollLabel: 'Scroll to explore',
  },
  HI: {
    kicker: 'कबीर एसोसिएशन ऑफ़ टोरंटो',
    h1: 'कबीर के उपदेशों के लिए एक शांत स्थान',
    cta: 'ठहराव में प्रवेश करें',
    scrollLabel: 'और जानें',
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

function scrollToQuote() {
  const el = document.getElementById('quote');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;

  return (
    <section
      className="scheme-1"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <PlaceholderImg
        alt="Spiritual background"
        gradient="linear-gradient(160deg, #0d0f0e 0%, #1b1e1c 30%, #2a1a08 60%, #563401 100%)"
        style={{
          position: 'absolute',
          inset: 0,
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1280,
          margin: '0 auto',
          padding: '6rem 1.5rem 4rem',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Left Column */}
        <div>
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Unicase", serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--color-text, #f5f0e8)',
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
            }}
          >
            {t.h1}
          </motion.h1>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              onClick={() => toast && toast(t.cta)}
              style={{
                padding: '0.9rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'var(--color-accent, #d98204)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              {t.cta}
            </Button>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-body, sans-serif)',
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-accent, #d98204)',
              marginBottom: '1rem',
            }}
          >
            {t.kicker}
          </p>
          <div
            style={{
              width: 48,
              height: 2,
              background: 'var(--color-accent, #d98204)',
              opacity: 0.4,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onClick={scrollToQuote}
        aria-label={t.scrollLabel}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: 'none',
          border: '1px solid rgba(245,240,232,0.2)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--color-text, #f5f0e8)',
          transition: 'border-color 0.3s',
        }}
      >
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <path d="M4 6l4 4 4-4" />
        </motion.svg>
      </motion.button>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
