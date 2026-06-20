import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import { supabase } from '../../lib/supabase';
import './DrJDasPage.css';

const getPdfUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  const { data } = supabase.storage.from('documents').getPublicUrl(filename);
  return data?.publicUrl;
};

const getImageUrl = (filename) => {
  if (!filename) return null;
  const { data } = supabase.storage.from('general-images').getPublicUrl(filename);
  return data?.publicUrl;
};

export default function DrJDasPage() {
  const c = useTranslation('DrJDasPage');
  const navigate = useNavigate();

  const handleLinkClick = (e) => {
    const target = e.target.closest('a');
    if (target) {
      const href = target.getAttribute('href');
      // Intercept local links and route them via navigate to avoid page reload
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  const worksKeys = [
    'religiousHorizons',
    'sakhis',
    'pictorial',
    'multimedia',
    'bhajanAmritam',
    'essays',
    'bookOfPrayers',
    'poems',
    'bijak',
    'otherReadings'
  ];

  return (
    <div className="page-content drjdas-page" onClick={handleLinkClick}>
      {/* Hero Header */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '0.5rem' }}>{c.title}</h1>
              <h2 className="h4" style={{ color: 'var(--tahiti-gold-dark)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {c.subtitle}
              </h2>
              <p className="lead muted2" style={{ fontStyle: 'italic', fontSize: '1.15rem' }}>{c.role}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Grid: Bio and Contact */}
      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="drjdas-grid">
              {/* Left Column: Portrait Image */}
              <div className="drjdas-portrait-container">
                <img
                  src={getImageUrl('dr-das-chair-768x1075.jpg')}
                  alt={c.subtitle || ''}
                  className="drjdas-portrait-img"
                />
              </div>

              {/* Right Column: Bio & Contact */}
              <div className="drjdas-details">
                <div className="drjdas-bio">
                  {c.bioParagraphs && c.bioParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="drjdas-contact-card">
                  <h3 className="drjdas-contact-title">{c.contactInfoTitle}</h3>
                  <div className="drjdas-contact-list">
                    <div className="drjdas-contact-item">
                      <Icon name="mail" className="contact-icon" size={20} />
                      <p>
                        <a href={`mailto:${c.emailVal}`}>{c.emailLabel}: {c.emailVal}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Works Section */}
          <section className="drjdas-works-section">
            <AnimatedSection>
              <h2 className="h2 drjdas-section-title">{c.worksTitle}</h2>
              <div className="drjdas-works-grid">
                {c.works && worksKeys.map((key) => {
                  const work = c.works[key];
                  if (!work) return null;

                  const hasSections = work.sections && work.sections.length > 0;

                  return (
                    <div key={key} className="card-container drjdas-card">
                      <div>
                        <div className="drjdas-card-header">
                          <h3 className="drjdas-card-title">{work.title}</h3>
                        </div>
                        
                        <p className="drjdas-card-desc" dangerouslySetInnerHTML={{ __html: work.desc || '' }} />
                      </div>

                      {(work.pdfUrl || hasSections) && (
                        <div className="drjdas-card-sections">
                          {work.pdfUrl && (
                            <div className="drjdas-sub-item">
                              <span>{work.title}</span>
                              <a
                                href={getPdfUrl(work.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sub-pdf-btn"
                              >
                                <Icon name="picture_as_pdf" size={14} />
                                {work.title} PDF
                              </a>
                            </div>
                          )}

                          {hasSections && work.sections.map((sec, idx) => (
                            <div key={idx} className="drjdas-sub-item">
                              <span>{sec.title}</span>
                              {sec.pdfUrl && (
                                <a
                                  href={getPdfUrl(sec.pdfUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="sub-pdf-btn"
                                >
                                  <Icon name="picture_as_pdf" size={14} />
                                  {sec.shortTitle || sec.title} PDF
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </section>
        </div>
      </section>
    </div>
  );
}
