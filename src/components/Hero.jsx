import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui';

const VIDEO_SRC = '/hero_video_1.mp4';
const CROSSFADE_DURATION = 1.5; // seconds before end to begin cross-fade
const FADE_MS = 1200; // CSS transition duration in ms

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

const videoBaseStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  transition: `opacity ${FADE_MS}ms ease-in-out`,
};

export default function Hero({ lang = 'EN', toast }) {
  const t = TEXT[lang] || TEXT.EN;
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const swappingRef = useRef(false);            // prevents double-trigger
  const [activeVideo, setActiveVideo] = useState('A'); // which video is currently visible
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Safely play a video element
  const safePlay = useCallback((videoEl) => {
    if (!videoEl) return;
    const p = videoEl.play();
    if (p !== undefined) p.catch(() => {});
  }, []);

  // Cross-fade: when the active video nears its end, start the other from 0
  const handleTimeUpdate = useCallback((e) => {
    const video = e.target;
    if (!video.duration || swappingRef.current) return;

    const timeLeft = video.duration - video.currentTime;
    if (timeLeft <= CROSSFADE_DURATION) {
      swappingRef.current = true;

      const nextIsB = activeVideo === 'A';
      const nextVideo = nextIsB ? videoBRef.current : videoARef.current;

      if (nextVideo) {
        nextVideo.currentTime = 0;
        safePlay(nextVideo);
      }

      setActiveVideo(nextIsB ? 'B' : 'A');

      // Reset the guard after the fade completes + a small buffer
      setTimeout(() => { swappingRef.current = false; }, FADE_MS + 300);
    }
  }, [activeVideo, safePlay]);

  // Initial play
  useEffect(() => {
    safePlay(videoARef.current);
  }, [safePlay]);

  return (
    <section
      className="scheme-1"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Fallback gradient (shows while video loads or if video fails) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, #0d0f0e 0%, #1b1e1c 30%, #2a1a08 60%, #563401 100%)',
          zIndex: 0,
        }}
      />

      {/* Background Video A */}
      <video
        ref={videoARef}
        onCanPlayThrough={() => setInitialLoaded(true)}
        onTimeUpdate={activeVideo === 'A' ? handleTimeUpdate : undefined}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          ...videoBaseStyle,
          opacity: initialLoaded && activeVideo === 'A' ? 1 : 0,
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Background Video B */}
      <video
        ref={videoBRef}
        onTimeUpdate={activeVideo === 'B' ? handleTimeUpdate : undefined}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          ...videoBaseStyle,
          opacity: activeVideo === 'B' ? 1 : 0,
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Cinematic Overlay — multi-layer for depth and text legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.65) 100%),
            linear-gradient(to right,  rgba(0,0,0,0.55) 0%, transparent 60%)
          `,
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
              color: '#f5f0e8',
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}
          >
            {t.h1}
          </motion.h1>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              onClick={scrollToQuote}
              style={{
                padding: '0.9rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'var(--tahiti-gold, #d98204)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 24px rgba(217,130,4,0.3)',
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
              color: '#f5f0e8',
              marginBottom: '1rem',
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            {t.kicker}
          </p>
          <div
            style={{
              width: 48,
              height: 2,
              background: '#f5f0e8',
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
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(245,240,232,0.2)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#f5f0e8',
          transition: 'border-color 0.3s, background 0.3s',
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
