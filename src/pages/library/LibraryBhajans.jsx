import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../locales/useTranslation';
import { useBhajans } from '../../hooks/useBhajans';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow, Icon } from '../../components/ui';
import './LibraryBhajans.css';

export default function LibraryBhajans() {
  const t = useTranslation('LibraryBhajans');
  const { bhajans, loading } = useBhajans();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [fontSize, setFontSize] = useState(1); // multiplier
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [allOpen, setAllOpen] = useState(true);
  const tocRef = useRef(null);
  const contentRef = useRef(null);
  const location = useLocation();

  // Build TOC tree: { topCategory: { subCategory: [bhajans] } }
  const tocData = useMemo(() => {
    if (!bhajans || bhajans.length === 0) return {};
    const groups = {};
    bhajans.forEach(b => {
      const top = b.top_category || 'Other';
      const sub = b.sub_category || 'General';
      if (!groups[top]) groups[top] = {};
      if (!groups[top][sub]) groups[top][sub] = [];
      groups[top][sub].push(b);
    });
    return groups;
  }, [bhajans]);

  // Flat ordered list for prev/next
  const orderedBhajans = useMemo(() => {
    if (!bhajans || bhajans.length === 0) return [];
    return [...bhajans].sort((a, b) => a.sequence_order - b.sequence_order);
  }, [bhajans]);

  // Selected bhajan
  const selectedBhajan = useMemo(() => {
    if (!selectedId || !bhajans) return null;
    return bhajans.find(b => String(b.bhajan_id) === String(selectedId)) || null;
  }, [selectedId, bhajans]);

  // Current index in ordered list
  const currentIndex = useMemo(() => {
    if (!selectedBhajan) return -1;
    return orderedBhajans.findIndex(b => String(b.bhajan_id) === String(selectedBhajan.bhajan_id));
  }, [selectedBhajan, orderedBhajans]);

  const prevBhajan = currentIndex > 0 ? orderedBhajans[currentIndex - 1] : null;
  const nextBhajan = currentIndex < orderedBhajans.length - 1 ? orderedBhajans[currentIndex + 1] : null;

  // Search logic
  const searchResults = useMemo(() => {
    if (!search.trim() || !bhajans) return null;
    const q = search.toLowerCase();
    const results = bhajans.filter(b => {
      const titleMatch = b.title.toLowerCase().includes(q);
      const contentMatch = b.content_html && b.content_html.replace(/<[^>]+>/g, '').toLowerCase().includes(q);
      return titleMatch || contentMatch;
    }).slice(0, 30); // Limit results
    return results;
  }, [search, bhajans]);

  // Get a snippet around the matched text
  const getSnippet = useCallback((html, query) => {
    if (!html || !query) return '';
    const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return '';
    const start = Math.max(0, idx - 30);
    const end = Math.min(text.length, idx + query.length + 50);
    let snippet = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');
    // Highlight match
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    snippet = snippet.replace(re, '<mark>$1</mark>');
    return snippet;
  }, []);

  // Select a bhajan
  const handleSelect = (id) => {
    setSelectedId(id);
    setSearch('');
    
    // On mobile, just close the sidebar (TOC) without auto-scrolling.
    // The TOC remembers its state (open details, active selection) because it just gets hidden with CSS.
    if (window.innerWidth < 992) {
      setMobileTocOpen(false);
    }
  };

  // Copy lyrics
  const handleCopy = useCallback(() => {
    if (!selectedBhajan) return;
    const text = selectedBhajan.content_html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    navigator.clipboard.writeText(text).then(() => {
      setToastMsg('Lyrics copied to clipboard!');
      setTimeout(() => setToastMsg(''), 2500);
    });
  }, [selectedBhajan]);

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
      if (e.key === 'ArrowLeft' && prevBhajan) {
        handleSelect(prevBhajan.bhajan_id);
      } else if (e.key === 'ArrowRight' && nextBhajan) {
        handleSelect(nextBhajan.bhajan_id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevBhajan, nextBhajan, handleSelect]);

  // Auto-select bhajan from URL hash, or fallback to first bhajan once loaded
  useEffect(() => {
    if (orderedBhajans.length > 0) {
      const hash = location.hash;
      if (hash && hash.startsWith('#')) {
        const idFromHash = hash.substring(1);
        if (idFromHash) {
          const exists = orderedBhajans.some(b => String(b.bhajan_id) === idFromHash);
          if (exists) {
            setSelectedId(idFromHash);
            // Scroll content into view when deep-linked
            setTimeout(() => {
              if (contentRef.current) {
                contentRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
            return;
          }
        }
      }
      
      if (!selectedId) {
        setSelectedId(orderedBhajans[0].bhajan_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedBhajans, location.hash]);

  // Scroll selected TOC item into view
  useEffect(() => {
    if (selectedId && tocRef.current) {
      setTimeout(() => {
        const activeBtn = tocRef.current.querySelector('.toc-item-btn.active');
        if (activeBtn) {
          activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 100);
    }
  }, [selectedId]);

  const isSearching = search.trim().length > 0;
  const totalCount = bhajans ? bhajans.length : 0;

  return (
    <div className="page-content scheme-2 bhajans-page">
      <section className="section" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="prose center mx-auto">
              <Eyebrow>{t.library}</Eyebrow>
              <h1 className="h2" style={{ marginBottom: '16px' }}>{t.title}</h1>
              <p className="lead muted2" style={{ textAlign: 'justify', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {t.introPart1}
                <Link to="/library/transliteration" className="underline" style={{color: 'var(--tahiti-gold)'}}>
                  {t.introPart2}
                </Link>
                {t.introPart3}
                <Link to="/contact" className="underline" style={{color: 'var(--tahiti-gold)'}}>
                  {t.introPart4}
                </Link>
                {t.introPart5}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3 bhajans-content-section" style={{ borderRadius: '40px 40px 0 0' }}>
        <div className="container">
          <div className="bhajans-layout">

            {/* ======= Sidebar TOC ======= */}
            <aside className="bhajans-sidebar">
              <div className="bhajans-sidebar-inner">
                <button
                  className="bhajans-mobile-toggle"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                >
                  <Icon name="format_list_bulleted" />
                  <span>Table of Contents</span>
                  <Icon name={mobileTocOpen ? 'expand_less' : 'expand_more'} style={{ marginLeft: 'auto' }} />
                </button>

                <div className={`bhajans-sidebar-content ${mobileTocOpen ? 'open' : ''}`}>
                  {/* Search */}
                  <div className="bhajans-search-box">
                    <Icon name="search" className="bhajans-search-icon" />
                    <input
                      type="text"
                      className="bhajans-search-input"
                      placeholder="Search bhajans..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Toolbar */}
                  {!isSearching && (
                    <div className="bhajans-toc-toolbar">
                      <button className="bhajans-toc-toolbar-btn" onClick={() => handleToggleAll(true)}>
                        Expand All
                      </button>
                      <button className="bhajans-toc-toolbar-btn" onClick={() => handleToggleAll(false)}>
                        Collapse All
                      </button>
                      <span className="bhajans-toc-count">{totalCount} bhajans</span>
                    </div>
                  )}

                  {/* Tree or Search Results */}
                  <div className="bhajans-toc" ref={tocRef}>
                    {loading ? (
                      <p style={{ padding: '24px', textAlign: 'center', color: 'var(--fg3)' }}>Loading…</p>
                    ) : isSearching ? (
                      /* Search Results */
                      searchResults && searchResults.length > 0 ? (
                        <div className="toc-search-results">
                          {searchResults.map(b => (
                            <button key={b.id} className="toc-search-item" onClick={() => handleSelect(b.bhajan_id)}>
                              <p className="toc-search-title">{b.title}</p>
                              <p className="toc-search-category">{b.top_category} › {b.sub_category}</p>
                              {b.content_html && (
                                <p
                                  className="toc-search-snippet"
                                  dangerouslySetInnerHTML={{ __html: getSnippet(b.content_html, search) }}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="toc-no-results">
                          <Icon name="search_off" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }} />
                          No bhajans found for "{search}"
                        </div>
                      )
                    ) : (
                      /* TOC Tree */
                      Object.keys(tocData).map(top => {
                        const topContainsSelected = selectedId && Object.values(tocData[top]).some(subItems =>
                          subItems.some(b => String(b.bhajan_id) === String(selectedId))
                        );
                        return (
                          <details key={top} className="toc-top-details" open={allOpen || !!topContainsSelected}>
                            <summary>{top}</summary>
                            <div className="toc-top-content">
                              {Object.keys(tocData[top]).sort((a, b) => {
                                if (a === 'Introduction') return -1;
                                if (b === 'Introduction') return 1;
                                if (a === 'General') return -1;
                                if (b === 'General') return 1;
                                return a.localeCompare(b);
                              }).map(sub => {
                                const items = tocData[top][sub];
                                const isSub = sub !== top;
                                const subContainsSelected = selectedId && items.some(b => String(b.bhajan_id) === String(selectedId));

                                const itemList = (
                                  <ul className="toc-item-list">
                                    {items.map(b => (
                                      <li key={b.id} className="toc-item">
                                        <button
                                          className={`toc-item-btn ${String(selectedId) === String(b.bhajan_id) ? 'active' : ''}`}
                                          onClick={() => handleSelect(b.bhajan_id)}
                                          title={b.title}
                                        >
                                          {b.title}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                );

                                if (isSub) {
                                  return (
                                    <details key={sub} className="toc-sub-details" open={allOpen || !!subContainsSelected}>
                                      <summary>{sub}</summary>
                                      {itemList}
                                    </details>
                                  );
                                }

                                return <React.Fragment key={sub}>{itemList}</React.Fragment>;
                              })}
                            </div>
                          </details>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* ======= Main Content ======= */}
            <main className="bhajans-main" ref={contentRef}>
              {loading ? (
                <div className="bhajans-empty-state">
                  <Icon name="hourglass_empty" className="bhajans-empty-icon" />
                  <h3>Loading…</h3>
                  <p>Fetching bhajans from the database.</p>
                </div>
              ) : !selectedBhajan ? (
                <div className="bhajans-empty-state">
                  <Icon name="music_note" className="bhajans-empty-icon" />
                  <h3>Select a Bhajan</h3>
                  <p>Choose a bhajan from the table of contents to start reading.</p>
                </div>
              ) : (
                <div className="bhajan-card">
                  {/* Header */}
                  <div className="bhajan-header">
                    <div className="bhajan-breadcrumb">
                      <span>{selectedBhajan.top_category}</span>
                      <span className="bhajan-breadcrumb-sep">›</span>
                      <span>{selectedBhajan.sub_category}</span>
                      <span className="bhajan-breadcrumb-sep">›</span>
                      <span style={{ color: 'var(--fg1)' }}>{selectedBhajan.title}</span>
                    </div>

                    <div className="bhajan-title-row">
                      <div>
                        <h2 className="bhajan-title">{selectedBhajan.title}</h2>
                        {selectedBhajan.genre && (
                          <span className="bhajan-genre">{selectedBhajan.genre}</span>
                        )}
                      </div>
                      <div className="bhajan-actions">
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
                        <button className="bhajan-action-btn" onClick={handleCopy} title="Copy lyrics">
                          <Icon name="content_copy" className="ms" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bhajan-body">
                    <div
                      className="bhajan-content"
                      style={{ fontSize: `${fontSize}rem` }}
                      dangerouslySetInnerHTML={{ __html: selectedBhajan.content_html }}
                    />
                  </div>

                  {/* Navigation */}
                  <div className="bhajan-nav">
                    <button
                      className="bhajan-nav-btn"
                      disabled={!prevBhajan}
                      onClick={() => prevBhajan && handleSelect(prevBhajan.bhajan_id)}
                      title={prevBhajan ? prevBhajan.title : ''}
                    >
                      <Icon name="arrow_back" className="ms" />
                      <span className="bhajan-nav-title">{prevBhajan ? prevBhajan.title : 'Start'}</span>
                    </button>
                    <span style={{ fontSize: '0.72rem', color: 'var(--fg3)' }}>
                      {currentIndex + 1} / {orderedBhajans.length}
                    </span>
                    <button
                      className="bhajan-nav-btn"
                      disabled={!nextBhajan}
                      onClick={() => nextBhajan && handleSelect(nextBhajan.bhajan_id)}
                      title={nextBhajan ? nextBhajan.title : ''}
                    >
                      <span className="bhajan-nav-title">{nextBhajan ? nextBhajan.title : 'End'}</span>
                      <Icon name="arrow_forward" className="ms" />
                    </button>
                  </div>
                </div>
              )}
            </main>

          </div>
        </div>
      </section>

      {/* Toast */}
      <div className={`bhajan-toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
