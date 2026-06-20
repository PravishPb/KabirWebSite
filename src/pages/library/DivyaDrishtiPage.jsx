import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import { supabase } from '../../lib/supabase';
import './DivyaDrishtiPage.css';

const getPdfUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  const { data } = supabase.storage.from('documents').getPublicUrl(filename);
  return data?.publicUrl;
};

export default function DivyaDrishtiPage() {
  const c = useTranslation('DivyaDrishtiPage');
  const navigate = useNavigate();

  const handleLinkClick = (e) => {
    const target = e.target.closest('a');
    if (target) {
      const href = target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  const years = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];

  return (
    <div className="page-content divyadrishti-page" onClick={handleLinkClick}>
      {/* Hero Header */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1">{c.title}</h1>
              <h2 className="h4" style={{ color: 'var(--tahiti-gold-dark)', fontWeight: 600, marginBottom: '1.5rem' }}>
                {c.subtitle}
              </h2>
              <p className="lead muted2 divyadrishti-intro" style={{ textAlign: 'justify', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {c.description}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Grid of newsletters */}
      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="divyadrishti-grid">
              {years.map((year) => {
                const coverPath = `/divya-drishti/covers/divya-drishti-${year}-cover.png`;
                const pdfPath = getPdfUrl(`divya-drishti-${year}.pdf`);

                return (
                  <motion.div
                    key={year}
                    className="card-container divyadrishti-card"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="divyadrishti-link-wrapper">
                      <div className="divyadrishti-cover-wrapper">
                        <img
                          src={coverPath}
                          alt={`${c.newsletterTitle} ${year}`}
                          className="divyadrishti-cover-img"
                          loading="lazy"
                        />
                        <div className="divyadrishti-overlay">
                          <span className="divyadrishti-overlay-btn">
                            <Icon name="visibility" size={24} />
                          </span>
                        </div>
                      </div>
                      <div className="divyadrishti-card-body">
                        <h3 className="divyadrishti-card-title">{c.newsletterTitle} {year}</h3>
                        <div className="divyadrishti-action-btn">
                          <Icon name="picture_as_pdf" size={16} />
                          <span>{c.viewNewsletter}</span>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
