import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../locales/useTranslation';
import { useSakhis } from '../../hooks/useSakhis';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow, Icon } from '../../components/ui';
import './SakhisPage.css';

export default function SakhisPage() {
  const { lang } = useApp();
  const t = useTranslation('SakhisPage');
  const { sakhis, loading } = useSakhis();
  const [selectedId, setSelectedId] = useState('intro');
  const [search, setSearch] = useState('');
  const [fontSize, setFontSize] = useState(1);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [allOpen, setAllOpen] = useState(true);
  const tocRef = useRef(null);
  const contentRef = useRef(null);

  // Filter out the 'intro' sakhi from the regular lists
  const normalSakhis = useMemo(() => {
    if (!sakhis) return [];
    return sakhis.filter(s => s.sakhi_id !== 'intro');
  }, [sakhis]);

  // Fetch the intro sakhi for the intro view
  const introSakhi = useMemo(() => {
    if (!sakhis) return null;
    return sakhis.find(s => s.sakhi_id === 'intro') || null;
  }, [sakhis]);

  // Build TOC tree: { category: [sakhis] }
  const tocData = useMemo(() => {
    if (normalSakhis.length === 0) return {};
    const groups = {};
    normalSakhis.forEach(s => {
      const cat = s.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [normalSakhis]);

  // Flat ordered list for prev/next navigation
  const orderedSakhis = useMemo(() => {
    if (normalSakhis.length === 0) return [];
    return [...normalSakhis].sort((a, b) => a.sequence_order - b.sequence_order);
  }, [normalSakhis]);

  // Selected sakhi
  const selectedSakhi = useMemo(() => {
    if (selectedId === 'intro' || !sakhis) return null;
    return sakhis.find(s => s.sakhi_id === selectedId) || null;
  }, [selectedId, sakhis]);

  // Current index
  const currentIndex = useMemo(() => {
    if (!selectedSakhi) return -1;
    return orderedSakhis.findIndex(s => s.sakhi_id === selectedSakhi.sakhi_id);
  }, [selectedSakhi, orderedSakhis]);

  const prevSakhi = currentIndex > 0 ? orderedSakhis[currentIndex - 1] : null;
  const nextSakhi = currentIndex < orderedSakhis.length - 1 ? orderedSakhis[currentIndex + 1] : null;

  // Search logic
  const searchResults = useMemo(() => {
    if (!search.trim() || !sakhis) return null;
    const q = search.toLowerCase();
    // Exclude intro from search results as it has its own dedicated button
    return sakhis.filter(s => s.sakhi_id !== 'intro').filter(s => {
      const titleMatch = s.title && s.title.toLowerCase().includes(q);
      const coupletMatch = s.couplet && s.couplet.toLowerCase().includes(q);
      const meaningMatch = s.meaning && s.meaning.toLowerCase().includes(q);
      const commentaryMatch = s.commentary && s.commentary.toLowerCase().includes(q);
      return titleMatch || coupletMatch || meaningMatch || commentaryMatch;
    }).slice(0, 30);
  }, [search, sakhis]);

  // Get a snippet around the matched text
  const getSnippet = useCallback((text, query) => {
    if (!text || !query) return '';
    const cleanText = text.replace(/\s+/g, ' ');
    const lower = cleanText.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return cleanText.substring(0, 80) + (cleanText.length > 80 ? '…' : '');
    const start = Math.max(0, idx - 30);
    const end = Math.min(cleanText.length, idx + query.length + 50);
    let snippet = (start > 0 ? '…' : '') + cleanText.substring(start, end) + (end < cleanText.length ? '…' : '');
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    snippet = snippet.replace(re, '<mark>$1</mark>');
    return snippet;
  }, []);

  // Select a sakhi
  const handleSelect = (id) => {
    setSelectedId(id);
    setSearch('');
    if (window.innerWidth < 992) {
      setMobileTocOpen(false);
    }
  };

  // Copy sakhi content
  const handleCopy = useCallback(() => {
    if (!selectedSakhi) return;
    const text = `Sakhi ${selectedSakhi.sakhi_id}\n\nCouplet:\n${selectedSakhi.couplet}\n\nMeaning:\n${selectedSakhi.meaning}\n\nCommentary:\n${selectedSakhi.commentary}`;
    navigator.clipboard.writeText(text).then(() => {
      setToastMsg(t.toastCopied || 'Sakhi copied to clipboard!');
      setTimeout(() => setToastMsg(''), 2500);
    });
  }, [selectedSakhi, t]);

  // Collapse/Expand all
  const handleToggleAll = useCallback((open) => {
    if (!tocRef.current) return;
    const details = tocRef.current.querySelectorAll('details');
    details.forEach(d => { d.open = open; });
    setAllOpen(open);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft' && prevSakhi) {
        handleSelect(prevSakhi.sakhi_id);
      } else if (e.key === 'ArrowRight' && nextSakhi) {
        handleSelect(nextSakhi.sakhi_id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevSakhi, nextSakhi]);

  // Auto-select intro or first sakhi once loaded
  useEffect(() => {
    if (!selectedId && orderedSakhis.length > 0) {
      setSelectedId('intro');
    }
  }, [orderedSakhis, selectedId]);

  const isSearching = search.trim().length > 0;
  const totalCount = sakhis ? sakhis.length : 0;

  return (
    <div className="page-content scheme-2 sakhis-page">
      {/* Header Section */}
      <section className="section" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="prose center mx-auto">
              <Eyebrow>{t.eyebrow || 'Library'}</Eyebrow>
              <h1 className="h2" style={{ marginBottom: '16px' }}>{t.subtitle || 'Sakhis of Guru Kabir'}</h1>
              <p className="lead muted2" style={{ textAlign: 'justify', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {t.introText}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section scheme-3 sakhis-content-section" style={{ borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          <div className="sakhis-layout">

            {/* ======= Sidebar TOC ======= */}
            <aside className="sakhis-sidebar">
              <div className="sakhis-sidebar-inner">
                <button
                  className="sakhis-mobile-toggle"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                >
                  <Icon name="format_list_bulleted" />
                  <span>{t.tocTitle || 'Table of Contents'}</span>
                  <Icon name={mobileTocOpen ? 'expand_less' : 'expand_more'} style={{ marginLeft: 'auto' }} />
                </button>

                <div className={`sakhis-sidebar-content ${mobileTocOpen ? 'open' : ''}`}>
                  {/* Search */}
                  <div className="sakhis-search-box">
                    <Icon name="search" className="sakhis-search-icon" />
                    <input
                      type="text"
                      className="sakhis-search-input"
                      placeholder={t.searchPlaceholder || 'Search sakhis...'}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Toolbar */}
                  {!isSearching && (
                    <div className="sakhis-toc-toolbar">
                      <button className="sakhis-toc-toolbar-btn" onClick={() => handleToggleAll(true)}>
                        Expand All
                      </button>
                      <button className="sakhis-toc-toolbar-btn" onClick={() => handleToggleAll(false)}>
                        Collapse All
                      </button>
                      <span className="sakhis-toc-count">{totalCount} sakhis</span>
                    </div>
                  )}

                  {/* Tree or Search Results */}
                  <div className="sakhis-toc" ref={tocRef}>
                    {loading ? (
                      <p style={{ padding: '24px', textAlign: 'center', color: 'var(--fg3)' }}>Loading…</p>
                    ) : isSearching ? (
                      /* Search Results */
                      searchResults && searchResults.length > 0 ? (
                        <div className="sakhis-search-results">
                          {searchResults.map(s => (
                            <button key={s.sakhi_id} className="sakhis-search-item" onClick={() => handleSelect(s.sakhi_id)}>
                              <p className="sakhis-search-title">{s.title}</p>
                              <p className="sakhis-search-category">{s.category}</p>
                              {s.meaning && (
                                <p
                                  className="sakhis-search-snippet"
                                  dangerouslySetInnerHTML={{ __html: getSnippet(s.meaning, search) }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="sakhis-no-results">
                          <Icon name="search_off" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }} />
                          {t.noSakhisFound || 'No sakhis found for'} "{search}"
                        </div>
                      )
                    ) : (
                      /* TOC Tree grouped by category */
                      <>
                        <div style={{ padding: '0 8px 8px 8px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                          <button
                            className={`toc-item-btn ${selectedId === 'intro' ? 'active' : ''}`}
                            style={{ fontWeight: selectedId === 'intro' ? '600' : '500', fontSize: '0.88rem' }}
                            onClick={() => handleSelect('intro')}
                          >
                            <Icon name="info" style={{ fontSize: '16px', marginRight: '6px', verticalAlign: 'middle' }} />
                            {t.introduction}
                          </button>
                        </div>
                        {Object.keys(tocData).map(category => (
                          <details key={category} className="toc-top-details" open={allOpen}>
                            <summary>{category}</summary>
                            <div className="toc-top-content">
                              <ul className="toc-item-list">
                                {tocData[category].map(s => (
                                  <li key={s.sakhi_id} className="toc-item">
                                    <button
                                      className={`toc-item-btn ${selectedId === s.sakhi_id ? 'active' : ''}`}
                                      onClick={() => handleSelect(s.sakhi_id)}
                                      title={s.title}
                                    >
                                      {s.title}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </details>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* ======= Main Content ======= */}
            <main className="sakhis-main" ref={contentRef}>
              {loading ? (
                <div className="sakhis-empty-state">
                  <Icon name="hourglass_empty" className="sakhis-empty-icon" />
                  <h3>Loading…</h3>
                  <p>Fetching sakhis from the database.</p>
                </div>
              ) : selectedId === 'intro' ? (
                <div className="sakhi-card">
                  <div className="sakhi-header" style={{ paddingBottom: '16px', marginBottom: '24px' }}>
                    <div className="sakhi-title-row">
                      <div>
                        <h2 className="sakhi-title">{t.introduction}</h2>
                        <span className="sakhi-genre">{t.subtitle || 'Sakhis of Guru Kabir'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="sakhi-body" style={{ fontSize: `${fontSize}rem` }}>
                    {introSakhi ? introSakhi.commentary.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="sakhi-section-content" style={{ marginBottom: '1.2em' }}>
                        {paragraph}
                      </p>
                    )) : (
                      <p className="sakhi-section-content">Loading introduction...</p>
                    )}
                  </div>
                  <div className="sakhi-nav" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="sakhi-nav-btn"
                      onClick={() => orderedSakhis.length > 0 && handleSelect(orderedSakhis[0].sakhi_id)}
                      title={orderedSakhis.length > 0 ? orderedSakhis[0].title : ''}
                    >
                      <span className="sakhi-nav-title">{t.startReading}</span>
                      <Icon name="arrow_forward" />
                    </button>
                  </div>
                </div>
              ) : !selectedSakhi ? (
                <div className="sakhis-empty-state">
                  <Icon name="menu_book" className="sakhis-empty-icon" />
                  <h3>{t.subtitle || 'Sakhis of Guru Kabir'}</h3>
                  <p>{t.detailsEmpty || 'Select a Sakhi from the table of contents to start reading.'}</p>
                </div>
              ) : (
                <div className="sakhi-card">
                  {/* Header */}
                  <div className="sakhi-header">
                    <div className="sakhi-breadcrumb">
                      <span>{selectedSakhi.category}</span>
                      <span className="sakhi-breadcrumb-sep">›</span>
                      <span style={{ color: 'var(--fg1)' }}>{selectedSakhi.title}</span>
                    </div>

                    <div className="sakhi-title-row">
                      <div>
                        <h2 className="sakhi-title">{selectedSakhi.title}</h2>
                        <span className="sakhi-genre">{selectedSakhi.category}</span>
                      </div>
                      <div className="sakhi-actions">
                        <div className="font-size-controls">
                          <button
                            className="font-size-btn"
                            onClick={() => setFontSize(f => Math.max(0.8, f - 0.1))}
                            title="Decrease font size"
                          >
                            A−
                          </button>
                          <button
                            className="font-size-btn"
                            onClick={() => setFontSize(1)}
                            title="Reset font size"
                          >
                            A
                          </button>
                          <button
                            className="font-size-btn"
                            onClick={() => setFontSize(f => Math.min(1.6, f + 0.1))}
                            title="Increase font size"
                          >
                            A+
                          </button>
                        </div>
                        <button className="sakhi-action-btn" onClick={handleCopy} title="Copy Sakhi">
                          <Icon name="content_copy" />
                          <span>{t.copyButton || 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="sakhi-body" style={{ fontSize: `${fontSize}rem` }}>
                    {/* Couplet */}
                    {selectedSakhi.couplet && (
                      <div className="sakhi-couplet-box">
                        <Icon name="format_quote" className="sakhi-couplet-quote-icon" />
                        <p className="sakhi-couplet-text">{selectedSakhi.couplet}</p>
                      </div>
                    )}

                    {/* Meaning */}
                    {selectedSakhi.meaning && (
                      <div className="sakhi-section">
                        <h4 className="sakhi-section-title">{t.meaningLabel || 'Meaning'}</h4>
                        <p className="sakhi-section-content">{selectedSakhi.meaning}</p>
                      </div>
                    )}

                    {/* Commentary */}
                    {selectedSakhi.commentary && (
                      <div className="sakhi-section">
                        <h4 className="sakhi-section-title">{t.commentaryLabel || 'Commentary'}</h4>
                        <p className="sakhi-section-content">{selectedSakhi.commentary}</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="sakhi-nav">
                    <button
                      className="sakhi-nav-btn"
                      disabled={!prevSakhi}
                      onClick={() => prevSakhi && handleSelect(prevSakhi.sakhi_id)}
                      title={prevSakhi ? prevSakhi.title : ''}
                    >
                      <Icon name="arrow_back" />
                      <span className="sakhi-nav-title">{prevSakhi ? prevSakhi.title : 'Start'}</span>
                    </button>
                    <span style={{ fontSize: '0.72rem', color: 'var(--fg3)' }}>
                      {currentIndex + 1} / {orderedSakhis.length}
                    </span>
                    <button
                      className="sakhi-nav-btn"
                      disabled={!nextSakhi}
                      onClick={() => nextSakhi && handleSelect(nextSakhi.sakhi_id)}
                      title={nextSakhi ? nextSakhi.title : ''}
                    >
                      <span className="sakhi-nav-title">{nextSakhi ? nextSakhi.title : 'End'}</span>
                      <Icon name="arrow_forward" />
                    </button>
                  </div>
                </div>
              )}
            </main>

          </div>
        </div>
      </section>

      {/* Toast */}
      <div className={`sakhi-toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
