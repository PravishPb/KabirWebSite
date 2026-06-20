import React from 'react';
import { Eyebrow, AnimatedSection, StaggerContainer, StaggerItem, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './AudioVideoFilesPage.css';

export default function AudioVideoFilesPage() {
  const c = useTranslation('AudioVideoFilesPage');

  return (
    <div className="page-content audiovideo-page">
      {/* Hero Header Section */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <p className="lead muted2 audiovideo-intro">
                {c.desc}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Audio Discourses Section */}
      <section className="section scheme-3 audio-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="media-section-title text-center">{c.audioTitle}</h2>
          </AnimatedSection>

          <StaggerContainer className="audio-grid">
            {c.audios && c.audios.map((audio, idx) => (
              <StaggerItem key={idx} className="card-container audio-card scheme-4">
                <div className="audio-card-header">
                  <div className="audio-icon-wrapper">
                    <Icon name="volume_up" size={24} />
                  </div>
                  <h3 className="audio-card-title">{audio.title}</h3>
                </div>

                <div className="audio-player-wrapper">
                  <audio controls preload="none">
                    <source src={`/audio/${audio.filename}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Video Lectures & Interviews Section */}
      <section className="section scheme-3 video-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="media-section-title text-center">{c.videoTitle}</h2>
          </AnimatedSection>

          <StaggerContainer className="video-grid">
            {c.videos && c.videos.map((video, idx) => (
              <StaggerItem key={idx} className="card-container video-card scheme-4">
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
                  <p className="video-presenter">{video.presenter}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
