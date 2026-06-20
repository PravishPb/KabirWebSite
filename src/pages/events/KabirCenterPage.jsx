import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection, Eyebrow, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './KabirCenterPage.css';

const sliderImages = [
  "/images/kabir-center/center_slider_1.jpg",
  "/images/kabir-center/center_slider_2.jpg",
  "/images/kabir-center/center_slider_3.jpg",
  "/images/kabir-center/center_slider_4.jpg"
];

export default function KabirCenterPage() {
  const c = useTranslation('KabirCenterPage');
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
    <div className="page-content kabir-center-page">
      {/* Intro Header Section */}
      <section className="section scheme-2 text-center center-intro-section">
        <div className="container">
          <AnimatedSection>
            <div className="center-intro-text">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '2rem' }}>{c.title}</h1>
              
              <p className="center-paragraph lead">
                {c.intro}
              </p>
              
              <p className="center-paragraph lead muted2" style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
                {c.covidSatsang}
                <Link to="/contact"><strong><em><u>{c.covidSatsang_link}</u></em></strong></Link>
                {c.covidSatsang_post}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Image Gallery Slideshow Section */}
      <section className="section scheme-3 center-slider-section">
        <div className="container">
          <AnimatedSection>
            <div className="center-slider-container">
              <button 
                className="center-slider-arrow prev" 
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <Icon name="chevron_left" size={24} />
              </button>
              <button 
                className="center-slider-arrow next" 
                onClick={handleNext}
                aria-label="Next slide"
              >
                <Icon name="chevron_right" size={24} />
              </button>

              <div className="center-slide-wrapper">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={sliderImages[currentSlide]}
                    alt={`Kabir Center building ${currentSlide + 1}`}
                    className="center-slide-img"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.4 }}
                  />
                </AnimatePresence>
              </div>

              <div className="center-slider-dots">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`center-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Activities Details Section */}
      <section className="section scheme-3 center-content-section">
        <div className="container">
          <div className="center-content-card">
            <AnimatedSection>
              <h2 className="h3 center-section-title">{c.activities?.title}</h2>
            </AnimatedSection>
            
            <AnimatedSection>
              <p className="center-desc-text" style={{ marginTop: '1rem' }}>
                {c.activities?.yoga}
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <p className="center-desc-text muted2" style={{ fontStyle: 'italic', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                {c.activities?.covidYoga}
                <Link to="/contact"><strong><em><u>{c.activities?.covidYoga_link}</u></em></strong></Link>
                {c.activities?.covidYoga_post}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Donations & Payment Gateway Section */}
      <section className="section scheme-4 center-content-section">
        <div className="container">
          <div className="center-content-card">
            <AnimatedSection>
              <h2 className="h3 center-section-title">{c.donations?.title}</h2>
            </AnimatedSection>
            
            <AnimatedSection>
              <p className="center-desc-text" style={{ marginTop: '1rem' }}>
                {c.donations?.desc}
              </p>
            </AnimatedSection>

            {/* Styled PayPal Donation Card */}
            <AnimatedSection>
              <div className="donation-card-container">
                <Icon name="favorite" size={32} style={{ color: 'var(--tahiti-gold)' }} />
                <h3 className="donation-form-title">{c.donations?.title}</h3>
                <p className="donation-form-subtitle">
                  {c.donations?.button}
                </p>

                <div className="paypal-donate-btn-wrapper">
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
                      className="paypal-donate-btn-image"
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
