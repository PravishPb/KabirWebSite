import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Eyebrow, AnimatedSection, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';

// Import all JSON data
import lifeData from '../../data/jeevanDarshanLife.json';
import baawanKasniData from '../../data/jeevanDarshanBaawanKasni.json';
import shortStoriesData from '../../data/jeevanDarshanShortStories.json';
import shortStoriesContnData from '../../data/jeevanDarshanShortStoriesContn.json';
import disciplesData from '../../data/jeevanDarshanDisciples.json';

import '../library/PictorialGlimpsesPage.css'; // Re-use the pictorial glimpses styles!

export default function JeevanDarshanCategoryPage() {
  const c = useTranslation('JeevanDarshanPage'); // We reuse the translations for the title
  const { category } = useParams();
  const location = useLocation();

  const [activeStory, setActiveStory] = useState(1);
  const [showMobileToc, setShowMobileToc] = useState(false);

  // Map category slug to data and title
  const categoryMap = {
    'life': { data: lifeData, title: 'Life' },
    'baawan-kasni': { data: baawanKasniData, title: 'Baawan Kasni' },
    'short-stories': { data: shortStoriesData, title: 'Short Stories' },
    'short-stories-contn': { data: shortStoriesContnData, title: 'Short Stories (Cont\'n)' },
    'disciples-and-famous-followers': { data: disciplesData, title: 'Disciples and Famous Followers' },
  };

  const currentCategory = categoryMap[category] || { data: [], title: '' };
  const storiesData = currentCategory.data;

  // Handle hash scrolling on load
  useEffect(() => {
    if (location.hash && storiesData.length > 0) {
      setTimeout(() => {
        const idFromHash = location.hash.replace('#', '');
        const element = document.getElementById(idFromHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          const matchedStory = storiesData.find(s => s.anchor_id === idFromHash || `story-${s.id}` === idFromHash);
          if (matchedStory) {
            setActiveStory(matchedStory.id);
          }
        }
      }, 300);
    }
  }, [location.hash, storiesData]);

  // Smooth scroll to a story section
  const handleScrollToStory = (story) => {
    setActiveStory(story.id);
    setShowMobileToc(false);
    const elementId = story.anchor_id || `story-${story.id}`;
    const element = document.getElementById(elementId);
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
      const elementId = story.anchor_id || `story-${story.id}`;
      const el = document.getElementById(elementId);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [storiesData]);

  // Find the active story title for mobile TOC toggle button
  const currentActiveTitle = storiesData.find(s => s.id === activeStory)?.title || '';

  return (
    <div className="page-content pictorial-page">
      {/* Header Section */}
      <section className="section scheme-2 text-center" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>
                <Link to="/satguru/jeevan-darshan" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {c.title}
                </Link>
              </Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{currentCategory.title}</h1>
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
                  onClick={() => handleScrollToStory(story)}
                >
                  {story.title}
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
                    onClick={() => handleScrollToStory(story)}
                    title={story.title}
                  >
                    {story.title}
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
                    id={story.anchor_id || `story-${story.id}`}
                    className="story-section"
                    data-story-id={story.id}
                  >
                    <AnimatedSection className="card-container story-card scheme-3">
                      <h3 className="story-title">
                        {story.title}
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
