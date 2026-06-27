import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, AnimatedSection, StaggerContainer, StaggerItem } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import { useApp } from '../../context/AppContext';
import './KabirNightPage.css';

export default function KabirNightPage() {
  const c = useTranslation('KabirNightPage');
  const { lang } = useApp();

  return (
    <div className="page-content kabir-night-page">
      {/* Hero Header Section */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>{c.title}</h1>
              <p className="lead muted2 kabir-night-intro" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {c.desc}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="section scheme-3 kabir-night-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="h2 text-center" style={{ marginBottom: '3.5rem', fontFamily: 'var(--font-heading)', color: 'var(--tahiti-gold-darker)' }}>
              {c.videosTitle}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="kabir-night-grid">
            {c.songs && c.songs.map((song, idx) => {
              const isComposer = song.videoId === 'JVMYmuihbeI';
              const singerLabel = isComposer ? c.sungAndComposed : c.sungBy;

              return (
                <StaggerItem key={idx} className="card-container kabir-night-card scheme-4">
                  <div className="video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${song.videoId}`}
                      title={song.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="video-info">
                    <div className="video-title-container">
                      <h3 className="video-title">“{song.title}”</h3>
                      <p className="video-singer">
                        {singerLabel}
                        <span className="video-singer-name">{song.singer}</span>
                      </p>
                    </div>
                    {song.lyricsBhajanId && (
                      <div className="video-lyrics-link">
                        {c.lyricsPrefix}
                        <Link to={`/library/bhajans#${song.lyricsBhajanId}`} className="lyrics-link">
                          {c.lyricsClickHere}
                        </Link>
                        {c.lyricsSuffix}
                      </div>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
