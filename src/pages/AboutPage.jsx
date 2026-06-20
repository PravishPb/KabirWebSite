import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eyebrow, Icon } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useTranslation } from '../locales/useTranslation';
import './AboutPage.css';

const sliderImages = [
  "/images/about/about_slider_1.png",
  "/images/about/about_slider_2.png",
  "/images/about/about_slider_3.jpg",
  "/images/about/about_slider_4.png"
];

export default function AboutPage() {
  const c = useTranslation('AboutPage');
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
    <div className="page-content about-page">
      {/* Page Title Header Section */}
      <section className="section scheme-2 text-center" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto" style={{ marginInline: 'auto' }}>
              <h1 className="h1">{c.title}</h1>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Biography / Intro Section */}
      <section className="section scheme-3 about-intro-section">
        <div className="container">
          <AnimatedSection>
            <div className="about-intro-text">
              {/* Floated Logo Wrap */}
              <div className="about-logo-wrapper">
                <img
                  src="/images/about/about_logo.png"
                  alt="Kabir Association Logo"
                  className="about-logo-img"
                />
              </div>

              <h2 className="about-header-title">{c.headerTitle}</h2>
              
              <p className="about-paragraph lead">
                {c.intro}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Image Gallery Slideshow */}
      <section className="section scheme-3 about-slider-section">
        <div className="container">
          <AnimatedSection>
            <div className="about-slider-container">
              <button 
                className="about-slider-arrow prev" 
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <Icon name="chevron_left" size={24} />
              </button>
              <button 
                className="about-slider-arrow next" 
                onClick={handleNext}
                aria-label="Next slide"
              >
                <Icon name="chevron_right" size={24} />
              </button>

              <div className="about-slide-wrapper">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={sliderImages[currentSlide]}
                    alt={`Kabir Association activities ${currentSlide + 1}`}
                    className="about-slide-img"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
              </div>

              <div className="about-slider-dots">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`about-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Regular Activities Section */}
      <section className="section scheme-3 about-content-section">
        <div className="container">
          <div className="about-content-card">
            <AnimatedSection>
              <p className="about-paragraph lead" style={{ color: 'var(--fg1)', fontWeight: 500 }}>
                {c.activitiesIntro}
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <ul className="about-list">
                <li className="about-list-item">
                  <strong>{c.activity1_bold}</strong>{c.activity1_text}
                </li>
                <li className="about-list-item">
                  <strong>{c.activity2}</strong>
                </li>
                <li className="about-list-item">
                  <Link to="/events/chowka"><strong><u>{c.activity3_link}</u></strong></Link>
                  <strong>{c.activity3_post}</strong>
                </li>
                <li className="about-list-item">
                  <strong>{c.activity4}</strong>
                </li>
              </ul>
            </AnimatedSection>


          </div>
        </div>
      </section>

      {/* Donations Card Section */}
      <section className="section scheme-4 about-content-section">
        <div className="container">
          <div className="about-content-card">
            <AnimatedSection>
              <h2 className="h3 about-section-title">{c.donations?.title}</h2>
            </AnimatedSection>

            <AnimatedSection>
              <p className="about-paragraph" style={{ marginTop: '1rem' }}>
                {c.donations?.desc}
              </p>
            </AnimatedSection>

            {/* Styled PayPal Donation Card */}
            <AnimatedSection>
              <div className="about-donation-card-container">
                <Icon name="favorite" size={32} style={{ color: 'var(--tahiti-gold)' }} />
                <h3 className="about-donation-form-title">{c.donations?.title}</h3>
                <p className="about-donation-form-subtitle">
                  {c.donations?.button}
                </p>

                <div className="about-paypal-donate-btn-wrapper">
                  <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" className="paypal-form">
                    <input type="hidden" name="cmd" value="_donations" />
                    <input type="hidden" name="business" value="kabirassociationoftoronto@gmail.com" />
                    <input type="hidden" name="currency_code" value="CAD" />
                    <input type="hidden" name="notify_url" value="https://kabirassociationoftoronto.org/wp-admin/admin-post.php?action=add_wpedon_button_ipn" />
                    <input type="hidden" name="lc" value="en_US" />
                    <input type="hidden" name="bn" value="WPPlugin_SP" />
                    <input type="hidden" name="custom" value="1989" />
                    <input type="hidden" name="no_shipping" value="1" />
                    <input type="hidden" name="no_note" value="1" />
                    <input 
                      type="image" 
                      src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_pp_142x27.png" 
                      name="submit" 
                      alt={c.donations?.button}
                      title={c.donations?.button}
                      className="about-paypal-donate-btn-image"
                    />
                    <img 
                      alt="" 
                      border="0" 
                      src="https://www.paypal.com/en_US/i/scr/pixel.gif" 
                      width="1" 
                      height="1" 
                      style={{ border: 'none', display: 'none' }} 
                    />
                  </form>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
