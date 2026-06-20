import React from 'react';
import { Eyebrow, AnimatedSection, StaggerContainer, StaggerItem } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './ReligiousHorizonsPage.css';

export default function ReligiousHorizonsPage() {
  const c = useTranslation('ReligiousHorizonsPage');

  return (
    <div className="page-content religious-horizons-page">
      {/* Hero Header Section */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <p className="lead muted2 religious-horizons-intro">
                {c.desc}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="section scheme-3 religious-horizons-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="h2 text-center" style={{ marginBottom: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--tahiti-gold-darker)' }}>
              {c.episodesTitle}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="religious-horizons-grid">
            {c.episodes && c.episodes.map((episode, idx) => (
              <StaggerItem key={idx} className="card-container religious-horizons-card scheme-4">
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${episode.videoId}`}
                    title={episode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-info">
                  <h3 className="video-title">{episode.title}</h3>
                  <p className="video-presenter">{episode.presenter}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
