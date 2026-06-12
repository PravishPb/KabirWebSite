import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import './Hero.css';

const VIDEO_SRC = '/hero_video_1.mp4';
const CROSSFADE_DURATION = 1.5; // seconds before end to begin cross-fade
const FADE_MS = 1200; // CSS transition duration in ms

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

export default function Hero() {
  const { lang, toast } = useApp();
  const t = useTranslation('Hero');
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
    <section className="scheme-1 hero-section">
      {/* Fallback gradient (shows while video loads or if video fails) */}
      <div aria-hidden="true" className="hero-fallback-bg" />

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
      <div aria-hidden="true" className="hero-overlay" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="hero-content-grid"
      >
        {/* Left Column */}
        <div>
          <motion.h1
            variants={fadeUp}
            className="hero-title"
          >
            {t.h1}
          </motion.h1>

          <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
            <Button
              onClick={scrollToQuote}
              className="hero-cta-btn"
            >
              {t.cta}
            </Button>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div variants={fadeUp} className="flex flex-col justify-center">
          <p className="hero-kicker">
            {t.kicker}
          </p>
          <div className="hero-kicker-divider" />
        </motion.div>
      </motion.div>

      {/* Scroll Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onClick={scrollToQuote}
        aria-label={t.scrollLabel}
        className="hero-scroll-btn"
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
    </section>
  );
}

