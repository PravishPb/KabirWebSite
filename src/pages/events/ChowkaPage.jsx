import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, Eyebrow, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './ChowkaPage.css';

const sliderImages = [
  "/images/chowka/chowkaslider1.png",
  "/images/chowka/chowkaslider2.png",
  "/images/chowka/chowkaslider3.png",
  "/images/chowka/chowkaslider4.png",
  "/images/chowka/chowkaslider5.png",
  "/images/chowka/chowkaslider6.png"
];

export default function ChowkaPage() {
  const c = useTranslation('ChowkaPage');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  return (
    <div className="page-content chowka-page">
      {/* Hero Header Section */}
      <section className="section scheme-2 text-center chowka-intro-section">
        <div className="container">
          <AnimatedSection>
            <div className="chowka-intro-text">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.75rem' }}>{c.title}</h1>
              <p className="chowka-paragraph lead muted2">
                {c.intro1}
              </p>
              <p className="chowka-paragraph lead muted2" style={{ marginBottom: 0 }}>
                {c.intro2}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Image Gallery/Slider */}
      <section className="section scheme-3 chowka-slider-section">
        <div className="container">
          <AnimatedSection>
            <div className="chowka-slider-container">
              <button 
                className="chowka-slider-arrow prev" 
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <Icon name="chevron_left" size={24} />
              </button>
              <button 
                className="chowka-slider-arrow next" 
                onClick={handleNext}
                aria-label="Next slide"
              >
                <Icon name="chevron_right" size={24} />
              </button>

              <div className="chowka-slide-wrapper">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={sliderImages[currentSlide]}
                    alt={`Chowka ceremony illustration ${currentSlide + 1}`}
                    className="chowka-slide-img"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
              </div>

              <div className="chowka-slider-dots">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`chowka-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Four Types of Chowka Grid */}
      <section className="section scheme-3 chowka-types-section">
        <div className="container">
          <AnimatedSection>
            <div className="chowka-grid-header">
              <h2 className="h2 chowka-grid-title">{c.typesTitle}</h2>
              <p className="chowka-grid-subtitle">{c.typesSubtitle}</p>
            </div>
          </AnimatedSection>

          <div className="chowka-grid">
            {/* Aanandee Chowka */}
            <AnimatedSection>
              <div className="chowka-card">
                <div className="chowka-card-header">
                  <div className="chowka-card-icon-wrapper">
                    <Icon name="celebration" size={24} />
                  </div>
                  <h3 className="h5 chowka-card-title">{c.types?.aanandee?.title}</h3>
                </div>
                <p className="chowka-card-desc">
                  {c.types?.aanandee?.desc1}
                  <Link to="/contact"><strong><em><u>{c.contactText}</u></em></strong></Link>
                  {c.types?.aanandee?.desc2}
                </p>
              </div>
            </AnimatedSection>

            {/* Chalaawaa Chowka */}
            <AnimatedSection>
              <div className="chowka-card">
                <div className="chowka-card-header">
                  <div className="chowka-card-icon-wrapper">
                    <Icon name="local_florist" size={24} />
                  </div>
                  <h3 className="h5 chowka-card-title">{c.types?.chalaawaa?.title}</h3>
                </div>
                <p className="chowka-card-desc">
                  {c.types?.chalaawaa?.desc1}
                  <Link to="/contact"><strong><em><u>{c.contactText}</u></em></strong></Link>
                  {c.types?.chalaawaa?.desc2}
                </p>
              </div>
            </AnimatedSection>

            {/* Janamautee Chowka */}
            <AnimatedSection>
              <div className="chowka-card">
                <div className="chowka-card-header">
                  <div className="chowka-card-icon-wrapper">
                    <Icon name="child_care" size={24} />
                  </div>
                  <h3 className="h5 chowka-card-title">{c.types?.janamautee?.title}</h3>
                </div>
                <p className="chowka-card-desc">
                  {c.types?.janamautee?.desc}
                </p>
              </div>
            </AnimatedSection>

            {/* Ekotaree Chowka */}
            <AnimatedSection>
              <div className="chowka-card">
                <div className="chowka-card-header">
                  <div className="chowka-card-icon-wrapper">
                    <Icon name="groups" size={24} />
                  </div>
                  <h3 className="h5 chowka-card-title">{c.types?.ekotaree?.title}</h3>
                </div>
                <p className="chowka-card-desc">
                  {c.types?.ekotaree?.desc}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
