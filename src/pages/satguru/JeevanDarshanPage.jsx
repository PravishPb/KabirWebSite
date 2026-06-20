import React from 'react';
import { Eyebrow, AnimatedSection, StaggerContainer, StaggerItem } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import './JeevanDarshanPage.css';

export default function JeevanDarshanPage() {
  const c = useTranslation('JeevanDarshanPage');
  const { lang } = useApp();

  // Split categories for 2-column display:
  // Left: Life, Baawan Kasni, Short Stories
  // Right: Short Stories (Cont'n), Disciples and Famous Followers
  const leftColCategories = c.categories ? c.categories.slice(0, 3) : [];
  const rightColCategories = c.categories ? c.categories.slice(3) : [];

  return (
    <div className="page-content jeevan-darshan-page">
      {/* Hero Header Section */}
      <section className="section scheme-2 text-center" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main TOC Grid Section */}
      <section className="section scheme-3 jeevan-darshan-section" style={{ borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          {/* Table of Contents Heading */}
          <AnimatedSection>
            <h2 className="h2 text-center" style={{ marginBottom: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--tahiti-gold-darker)' }}>
              {c.tocTitle}
            </h2>
          </AnimatedSection>

          {/* Grid of Stories */}
          <div className="jeevan-darshan-grid">
            {/* Left Column */}
            <StaggerContainer className="jeevan-darshan-col">
              {leftColCategories.map((cat, catIdx) => (
                <StaggerItem key={catIdx} className="category-block">
                  <h3 className="category-header">
                    <a href={cat.url} target="_blank" rel="noopener noreferrer" className="category-link">
                      {cat.title}
                    </a>
                  </h3>
                  <ul className="story-list">
                    {cat.stories && cat.stories.map((story, storyIdx) => (
                      <li key={storyIdx} className="story-item">
                        <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-link">
                          {story.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Right Column */}
            <StaggerContainer className="jeevan-darshan-col">
              {rightColCategories.map((cat, catIdx) => (
                <StaggerItem key={catIdx} className="category-block">
                  <h3 className="category-header">
                    <a href={cat.url} target="_blank" rel="noopener noreferrer" className="category-link">
                      {cat.title}
                    </a>
                  </h3>
                  <ul className="story-list">
                    {cat.stories && cat.stories.map((story, storyIdx) => (
                      <li key={storyIdx} className="story-item">
                        <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-link">
                          {story.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {cat.footerNote && (
                    <p className="footnote-note">{cat.footerNote}</p>
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Descriptive Content Footnotes */}
          <AnimatedSection className="jeevan-darshan-footer-text">
            <p>{c.desc}</p>
            <p>
              {lang === 'HI' ? (
                <>
                  यह ध्यान दिया जाना चाहिए कि कबीर साहेब के समय से, ऐसी कहानियों को मौखिक रूप से प्रसारित किया गया था और पीढ़ी दर पीढ़ी आगे बढ़ाया गया था; इसलिए, इनमें से प्रत्येक कहानी के कई संस्करण मौजूद हैं। हमने विभिन्न स्रोतों से प्रत्येक कहानी के कई संस्करणों का विश्लेषण और शोध किया है, विशेष रूप से कबीर मंसूर और कबीर कसौटी (अन्य स्रोतों के बीच) से। हमारे स्रोतों के बारे में अधिक जानकारी के लिए, कृपया हमसे{' '}
                  <Link to="/contact" className="text-underline-link">
                    संपर्क करने में संकोच न करें
                  </Link>
                  ।
                </>
              ) : (
                <>
                  It is to be noted that from the time of Kabir Saheb, such stories were transmitted orally and passed down from generation to generation; therefore, there exists many versions of each of these stories. We have analyzed and researched many versions of each story from various different sources most notably from the Kabeer Manshoor and the Kabeer Kasautee (amongst other sources). For further information on our sources, please feel free to{' '}
                  <Link to="/contact" className="text-underline-link">
                    contact us
                  </Link>
                  .
                </>
              )}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
