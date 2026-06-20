import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, Eyebrow, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './PerformancesPage.css';

const kabirNightImages = [
  "/images/performances/kabir_night_1.png",
  "/images/performances/kabir_night_2.png",
  "/images/performances/kabir_night_3.png",
  "/images/performances/kabir_night_4.png"
];

const chowtaalImages = [
  "/images/performances/chowtaal_1.png",
  "/images/performances/chowtaal_2.png",
  "/images/performances/chowtaal_3.jpg",
  "/images/performances/chowtaal_4.jpg"
];

const rediscoveringImages = [
  "/images/performances/rediscovering_1.jpg",
  "/images/performances/rediscovering_2.jpg",
  "/images/performances/rediscovering_3.jpg",
  "/images/performances/rediscovering_4.jpg"
];

const jhiniImages = [
  "/images/performances/jhini_1.jpg",
  "/images/performances/jhini_2.jpg",
  "/images/performances/jhini_3.jpg",
  "/images/performances/jhini_4.jpg"
];

function Slideshow({ images, autoPlayInterval = 6000 }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-playing transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [images.length, autoPlayInterval]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="perf-slider">
      <button 
        className="perf-slider-arrow prev" 
        onClick={handlePrev} 
        aria-label="Previous image"
      >
        <Icon name="chevron_left" size={20} />
      </button>
      <button 
        className="perf-slider-arrow next" 
        onClick={handleNext} 
        aria-label="Next image"
      >
        <Icon name="chevron_right" size={20} />
      </button>

      <div className="perf-slide-wrapper">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={images[currentSlide]}
            alt={`Performances slide ${currentSlide + 1}`}
            className="perf-slide-img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>

      <div className="perf-slider-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`perf-slider-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PerformancesPage() {
  const c = useTranslation('PerformancesPage');

  return (
    <div className="page-content performances-page">
      {/* Page Header */}
      <section className="section scheme-2 text-center performances-intro-section">
        <div className="container">
          <AnimatedSection>
            <div className="performances-intro-text">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <p className="lead muted2" style={{ marginBottom: 0 }}>{c.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Row 1: Saint Kabir Night (Content Left / Slideshow Right) */}
      <section className="section scheme-3 performances-row-section">
        <div className="container">
          <div className="performances-row">
            <AnimatedSection className="performances-content-col">
              <h2 className="h3 performances-title">{c.kabirNight?.title}</h2>
              <p className="performances-desc">
                {c.kabirNight?.desc1}
                <Link to="/library/kabir-night"><strong><em><u>{c.clickHere}</u></em></strong></Link>
                {c.kabirNight?.desc2}
              </p>
            </AnimatedSection>
            <AnimatedSection className="performances-slider-col">
              <Slideshow images={kabirNightImages} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Row 2: Holi Sammelan (Slideshow Left / Content Right) - REVERSED */}
      <section className="section scheme-4 performances-row-section">
        <div className="container">
          <div className="performances-row reverse">
            <AnimatedSection className="performances-content-col">
              <h2 className="h3 performances-title">{c.holiSammelan?.title}</h2>
              <p className="performances-desc">
                {c.holiSammelan?.desc1}
                <Link to="/library/holi-sammelan"><strong><em><u>{c.clickHere}</u></em></strong></Link>
                {c.holiSammelan?.desc2}
              </p>
            </AnimatedSection>
            <AnimatedSection className="performances-slider-col">
              <Slideshow images={chowtaalImages} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Row 3: Rediscovering Kabir (Content Left / Slideshow Right) */}
      <section className="section scheme-3 performances-row-section">
        <div className="container">
          <div className="performances-row">
            <AnimatedSection className="performances-content-col">
              <h2 className="h3 performances-title">{c.rediscovering?.title}</h2>
              <p className="performances-desc">
                {c.rediscovering?.desc}
              </p>
            </AnimatedSection>
            <AnimatedSection className="performances-slider-col">
              <Slideshow images={rediscoveringImages} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Row 4: Jhini Chadariya (Slideshow Left / Content Right) - REVERSED */}
      <section className="section scheme-4 performances-row-section">
        <div className="container">
          <div className="performances-row reverse">
            <AnimatedSection className="performances-content-col">
              <h2 className="h3 performances-title">{c.jhini?.title}</h2>
              <p className="performances-desc">
                {c.jhini?.desc}
              </p>
            </AnimatedSection>
            <AnimatedSection className="performances-slider-col">
              <Slideshow images={jhiniImages} />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
