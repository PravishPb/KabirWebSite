import React, { useState, useEffect, useRef } from 'react';
import { Eyebrow, AnimatedSection, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import storiesData from '../../data/pictorialStories.json';
import './PictorialGlimpsesPage.css';

export default function PictorialGlimpsesPage() {
  const c = useTranslation('PictorialGlimpsesPage');
  const [activeStory, setActiveStory] = useState(1);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const sectionRefs = useRef({});

  // Smooth scroll to a story section
  const handleScrollToStory = (id) => {
    setActiveStory(id);
    setShowMobileToc(false);
    const element = document.getElementById(`story-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IntersectionObserver to highlight active story on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.getAttribute('data-story-id'), 10);
          if (id) {
            setActiveStory(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe each story section
    storiesData.forEach((story) => {
      const el = document.getElementById(`story-${story.id}`);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Find the active story title for mobile TOC toggle button
  const currentActiveTitle = storiesData.find(s => s.id === activeStory)?.title || '';

  return (
    <div className="page-content pictorial-page">
      {/* Header Section */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <h2 className="h4" style={{ color: 'var(--tahiti-gold-dark)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {c.subtitle}
              </h2>
              <p className="lead muted2 pictorial-intro">
                {c.introText}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="section scheme-3">
        <div className="container">
          {/* Mobile TOC Drawer Trigger */}
          <button
            className="mobile-toc-toggle"
            onClick={() => setShowMobileToc(!showMobileToc)}
          >
            <span>{c.tocTitle}: <strong>{currentActiveTitle}</strong></span>
            <Icon name={showMobileToc ? 'expand_less' : 'expand_more'} size={24} />
          </button>

          {/* Collapsible Mobile TOC List */}
          {showMobileToc && (
            <div className="mobile-toc-dropdown">
              {storiesData.map((story) => (
                <button
                  key={story.id}
                  className={`sidebar-item-btn ${activeStory === story.id ? 'active' : ''}`}
                  onClick={() => handleScrollToStory(story.id)}
                >
                  {story.id}. {story.title}
                </button>
              ))}
            </div>
          )}

          <div className="pictorial-layout">
            {/* Desktop Sticky Sidebar Navigation */}
            <aside className="pictorial-sidebar">
              <h3 className="sidebar-title">{c.tocTitle}</h3>
              <div className="sidebar-menu">
                {storiesData.map((story) => (
                  <button
                    key={story.id}
                    className={`sidebar-item-btn ${activeStory === story.id ? 'active' : ''}`}
                    onClick={() => handleScrollToStory(story.id)}
                    title={story.title}
                  >
                    {story.id}. {story.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Right Main Stories Content */}
            <div className="pictorial-content">
              {storiesData.map((story) => {
                const hasImage = story.images && story.images.length > 0;
                return (
                  <div
                    key={story.id}
                    id={`story-${story.id}`}
                    className="story-section"
                    data-story-id={story.id}
                  >
                    <AnimatedSection className="card-container story-card scheme-3">
                      <h3 className="story-title">
                        {story.id}. {story.title}
                      </h3>

                      <div className="story-body">
                        {hasImage && (
                          <div className="story-image-container">
                            <img
                              src={story.images[0]}
                              alt={story.title}
                              className="story-img"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="story-paragraphs">
                          {story.paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      </div>
                    </AnimatedSection>
                  </div>
                );
              })}

              {/* End of Stories Note Card */}
              <AnimatedSection className="card-container pictorial-note-card">
                <p className="pictorial-note-text">{c.note}</p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
