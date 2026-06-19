import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow, Icon } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './PrayersPage.css';
import { supabase } from '../../lib/supabase';

const getPdfUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  const { data } = supabase.storage.from('documents').getPublicUrl(filename);
  return data?.publicUrl;
};

export default function PrayersPage() {
  const c = useTranslation('PrayersPage');
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  const toggleCard = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Safe fallback list of card keys to preserve render order
  const cardKeys = ['sandhya', 'guru', 'path', 'teesaa', 'aaratee'];

  return (
    <div className="page-content prayers-page" onClick={handleLinkClick}>
      {/* Hero Header */}
      <section className="section scheme-2 text-center">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className="h1">{c.title}</h1>
              <p className="lead muted2 prayers-intro">{c.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Grid of Prayers */}
      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="prayers-grid">
              {c.cards && cardKeys.map((key) => {
                const card = c.cards[key];
                if (!card) return null;

                const isExpanded = !!expanded[key];
                const hasSections = card.sections && card.sections.length > 0;

                return (
                  <motion.div 
                    key={key} 
                    className="prayer-card"
                    layout="position"
                  >
                    <div className="prayer-card-header">
                      <div>
                        <h2 className="h4 prayer-card-title">{card.title}</h2>
                      </div>
                    </div>

                    <p className="prayer-card-desc">{card.description}</p>

                    <div className="prayer-actions">
                      {/* Action buttons for PDF downloads */}
                      {card.pdfUrl && (
                        <a 
                          href={getPdfUrl(card.pdfUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="pdf-btn primary"
                        >
                          <Icon name="picture_as_pdf" size={16} />
                          {card.pdfUrlEng ? c.downloadBilingual : c.downloadGeneral}
                        </a>
                      )}
                      
                      {card.pdfUrlEng && (
                        <a 
                          href={getPdfUrl(card.pdfUrlEng)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="pdf-btn"
                        >
                          <Icon name="picture_as_pdf" size={16} />
                          {c.downloadEnglish}
                        </a>
                      )}

                      {/* Content sections expand toggle */}
                      {hasSections && (
                        <button 
                          onClick={() => toggleCard(key)} 
                          className="toggle-sections-btn"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? c.hideSections : c.viewSections}
                          <Icon 
                            name={isExpanded ? 'expand_less' : 'expand_more'} 
                            size={20} 
                          />
                        </button>
                      )}
                    </div>

                    {/* Collapsible Sections List */}
                    {hasSections && (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="prayer-sections-list">
                              {card.sections.map((sec, idx) => (
                                <div key={idx} className="prayer-section-item">
                                  <h4>{sec.title}</h4>
                                  <p dangerouslySetInnerHTML={{ __html: sec.desc }} />
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
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
