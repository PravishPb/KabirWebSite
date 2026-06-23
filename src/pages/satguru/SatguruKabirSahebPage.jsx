import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Eyebrow, AnimatedSection, Icon } from '../../components/ui';
import satguruData from '../../data/satguruKabirSaheb.json';
import './SatguruKabirSahebPage.css';

const SLIDES = [
  {
    image: '/images/satguru/slide-1.png',
    link: '/satguru/jeevan-darshan/life',
    captionEN: 'Satguru Kabir Saheb',
    captionHI: 'सद्गुरु कबीर साहेब'
  },
  {
    image: '/images/satguru/slide-3.png',
    link: '/satguru/jeevan-darshan/life#jeevdar2',
    captionEN: 'Pragatya Darshan (Appearance at Lahartara Pond)',
    captionHI: 'प्रकट्य दर्शन (लहरतारा तालाब में प्रकटन)'
  },
  {
    image: '/images/satguru/slide-2.png',
    link: '/satguru/jeevan-darshan/baawan-kasni#jeevdar9',
    captionEN: 'Meeting Emperor Sikandar Lodi',
    captionHI: 'सम्राट सिकंदर लोदी से भेंट'
  },
  {
    image: '/images/satguru/slide-4.png',
    link: '/satguru/jeevan-darshan/life#jeevdar8',
    captionEN: 'Journey to Maghar',
    captionHI: 'मगहर की यात्रा'
  }
];

export default function SatguruKabirSahebPage() {
  const { lang } = useApp();
  const [activeSection, setActiveSection] = useState('1');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const content = satguruData[lang] || satguruData.EN;

  // Auto cycle slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  // Handle hash scrolling on page load if applicable
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const idFromHash = hash.replace('#section-', '').replace('#', '');
        const element = document.getElementById(`section-${idFromHash}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(idFromHash);
        }
      }, 300);
    }
  }, []);

  // IntersectionObserver to highlight active TOC item on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section-id');
          if (id) {
            setActiveSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    content.sections.forEach((section) => {
      const el = document.getElementById(`section-${section.id}`);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [content.sections]);

  const handleScrollToSection = (id) => {
    setActiveSection(id);
    setShowMobileToc(false);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeSectionTitle = content.sections.find(s => s.id === activeSection)?.title || '';

  return (
    <div className="page-content satguru-saheb-page">
      {/* Hero Header Banner */}
      <section className="section scheme-2" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="text-center" style={{ marginBottom: '2rem' }}>
              <Eyebrow>{content.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '0.5rem' }}>{content.title}</h1>
            </div>

            {/* Split Grid for Portrait and Life Scenes Slideshow */}
            <div className="satguru-hero-grid" style={{ marginBottom: '3rem' }}>
              {/* Left Column: Portrait */}
              <div className="satguru-portrait-wrapper">
                <img
                  src="/images/satguru/portrait.jpg"
                  alt="Satguru Kabir Saheb"
                  className="satguru-portrait-img"
                  loading="lazy"
                />
              </div>

              {/* Right Column: Slideshow */}
              <div className="satguru-slideshow-wrapper">
                {SLIDES.map((slide, idx) => (
                  <div
                    key={idx}
                    className="satguru-slide"
                    style={{
                      opacity: activeSlide === idx ? 1 : 0,
                      pointerEvents: activeSlide === idx ? 'auto' : 'none',
                      transition: 'opacity 0.6s ease',
                      zIndex: activeSlide === idx ? 2 : 1
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={lang === 'HI' ? slide.captionHI : slide.captionEN}
                      className="satguru-slide-img"
                      loading="lazy"
                    />
                  </div>
                ))}

                {/* Left/Right Buttons */}
                <button className="satguru-slider-btn prev" onClick={handlePrevSlide}>
                  <Icon name="chevron_left" size={24} />
                </button>
                <button className="satguru-slider-btn next" onClick={handleNextSlide}>
                  <Icon name="chevron_right" size={24} />
                </button>

                {/* Dots indicator */}
                <div className="satguru-slider-dots">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      className={`satguru-slider-dot ${activeSlide === idx ? 'active' : ''}`}
                      onClick={() => setActiveSlide(idx)}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Intro text below */}
            <div className="prose mx-auto text-center" style={{ marginTop: '2rem' }}>
              <div className="satguru-intro text-center">
                <p>
                  {content.intro1}{' '}
                  <Link to="/satguru/jeevan-darshan" className="internal-link">
                    <strong>{content.clickHere}</strong>
                  </Link>
                  .
                </p>
                <p style={{ marginTop: '1.5rem' }}>
                  {content.intro2}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main content grid */}
      <section className="section scheme-3" style={{ borderRadius: '40px 40px 0 0', marginTop: '-20px' }}>
        <div className="container">
          {/* Mobile TOC Drawer Trigger */}
          <button
            className="mobile-satguru-toc-toggle"
            onClick={() => setShowMobileToc(!showMobileToc)}
          >
            <span>{content.tocTitle}: <strong>{activeSectionTitle}</strong></span>
            <Icon name={showMobileToc ? 'expand_less' : 'expand_more'} size={24} />
          </button>

          {/* Collapsible Mobile TOC List */}
          {showMobileToc && (
            <div className="mobile-satguru-toc-dropdown">
              {content.sections.map((section) => (
                <button
                  key={section.id}
                  className={`satguru-sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => handleScrollToSection(section.id)}
                >
                  {section.title}
                </button>
              ))}
            </div>
          )}

          <div className="satguru-layout">
            {/* Desktop Sticky Sidebar Navigation */}
            <aside className="satguru-sidebar">
              <h3 className="sidebar-title" id="toc-title">{content.tocTitle}</h3>
              <div className="satguru-sidebar-menu">
                {content.sections.map((section) => (
                  <button
                    key={section.id}
                    className={`satguru-sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => handleScrollToSection(section.id)}
                    title={section.title}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Side Main Sections */}
            <div className="satguru-content">
              {content.sections.map((section) => (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  className="satguru-section"
                  data-section-id={section.id}
                >
                  <AnimatedSection className="card-container satguru-card scheme-3">
                    <h3 className="satguru-section-title">{section.title}</h3>
                    <div className="satguru-body">
                      {/* Render paragraphs before verses */}
                      {section.paragraphs && section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}

                      {/* Render verses */}
                      {section.verses && section.verses.map((verse, vIdx) => (
                        <div key={vIdx} className="verse-card">
                          {verse.type && <span className="verse-label">{verse.type}</span>}
                          <div className="verse-original">{verse.original}</div>
                          <div className="verse-translation">{verse.translation}</div>
                        </div>
                      ))}

                      {/* Render source if present */}
                      {section.source && (
                        <div className="verse-source">{section.source}</div>
                      )}

                      {/* Render guideLink if present */}
                      {section.guideLink && (
                        <p className="t-small" style={{ fontStyle: 'italic', margin: '0.5rem 0 0' }}>
                          ({lang === 'HI' ? (
                            <>
                              लिप्यंतरण और उच्चारण गाइड के लिए{' '}
                              <Link to="/library/transliteration" className="internal-link">
                                <strong>यहाँ क्लिक करें</strong>
                              </Link>
                            </>
                          ) : (
                            <>
                              For transliteration and pronunciation guide{' '}
                              <Link to="/library/transliteration" className="internal-link">
                                <strong>click here</strong>
                              </Link>
                            </>
                          )})
                        </p>
                      )}

                      {/* Render paragraphsAfter if present */}
                      {section.paragraphsAfter && section.paragraphsAfter.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}

                      {/* Render verses2 if present */}
                      {section.verses2 && section.verses2.map((verse, vIdx) => (
                        <div key={vIdx} className="verse-card">
                          {verse.type && <span className="verse-label">{verse.type}</span>}
                          <div className="verse-original">{verse.original}</div>
                          <div className="verse-translation">{verse.translation}</div>
                        </div>
                      ))}

                      {/* Render source2 if present */}
                      {section.source2 && (
                        <div className="verse-source">{section.source2}</div>
                      )}

                      {/* Render guideLink2 if present */}
                      {section.guideLink2 && (
                        <p className="t-small" style={{ fontStyle: 'italic', margin: '0.5rem 0 0' }}>
                          ({lang === 'HI' ? (
                            <>
                              लिप्यंतरण और उच्चारण गाइड के लिए{' '}
                              <Link to="/library/transliteration" className="internal-link">
                                <strong>यहाँ क्लिक करें</strong>
                              </Link>
                            </>
                          ) : (
                            <>
                              For transliteration and pronunciation guide{' '}
                              <Link to="/library/transliteration" className="internal-link">
                                <strong>click here</strong>
                              </Link>
                            </>
                          )})
                        </p>
                      )}

                      {/* Render paragraphsAfter2 if present */}
                      {section.paragraphsAfter2 && section.paragraphsAfter2.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </AnimatedSection>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
