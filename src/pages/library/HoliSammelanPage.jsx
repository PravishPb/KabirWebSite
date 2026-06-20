import React from 'react';
import { Eyebrow, AnimatedSection, StaggerContainer, StaggerItem } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './HoliSammelanPage.css';

export default function HoliSammelanPage() {
  const c = useTranslation('HoliSammelanPage');

  return (
    <div className="page-content holi-sammelan-page">
      {/* Hero Header Section */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <p className="lead muted2 holi-sammelan-intro" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {c.desc}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="section scheme-3 holi-sammelan-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="h2 text-center" style={{ marginBottom: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--tahiti-gold-darker)' }}>
              {c.videosTitle}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="holi-sammelan-grid">
            {c.videos && c.videos.map((video, idx) => (
              <StaggerItem key={idx} className="card-container holi-sammelan-card scheme-4">
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-location">
                    <span className="location-host">{video.host}</span>
                    <span className="location-address">{video.address}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
