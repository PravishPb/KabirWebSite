import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eyebrow, AsyncImage, PlaceholderImg, Icon, EventSearch } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useTranslation } from '../locales/useTranslation';
import { useNews } from '../hooks/useNews';
import { useNewsFilters } from '../hooks/useNewsFilters';
import './BlogPage.css'; // Reusing layout & card grid styles
import './NewsPage.css';

const gradients = [
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
];

export default function NewsPage() {
  const t = useTranslation('NewsPage');
  const { news, loading } = useNews();
  const [currentPage, setCurrentPage] = useState(1);

  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const processedNews = news.map(item => ({
    ...item,
    title: item.title ? decodeHTML(item.title) : '',
    body_plain: item.body_text ? decodeHTML(item.body_text).replace(/<[^>]+>/g, '') : '',
    body_text: item.body_text || ''
  }));

  // Search Filter
  const { searchQuery, setSearchQuery, filteredNews } = useNewsFilters(processedNews);

  // Pagination Configuration (6 items per page for public news list is very standard)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedNews = filteredNews.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisibleNeighbors = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages) {
        pages.push(i);
      } else if (i >= safeCurrentPage - maxVisibleNeighbors && i <= safeCurrentPage + maxVisibleNeighbors) {
        pages.push(i);
      } else if (i === safeCurrentPage - maxVisibleNeighbors - 1 || i === safeCurrentPage + maxVisibleNeighbors + 1) {
        if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
      }
    }
    return pages;
  };

  return (
    <div className="page-content">
      {/* Header section */}
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center news-header-wrapper">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1">{t.title}</h1>
              <p className="lead news-header-lead">{t.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main content grid */}
      <section className="section scheme-3 news-section-main">
        <div className="container">
          {loading ? (
            <div className="news-loading-spinner">{t.loading}</div>
          ) : news.length === 0 ? (
            <AnimatedSection>
              <p className="muted2 news-empty-box">{t.noNews}</p>
            </AnimatedSection>
          ) : (
            <>
              {/* Centralized Search Bar Component */}
              <EventSearch
                value={searchQuery}
                onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                placeholder={t.searchPlaceholder}
              />

              {filteredNews.length === 0 ? (
                <AnimatedSection>
                  <p className="muted2 news-empty-box">{t.noMatchingNews}</p>
                </AnimatedSection>
              ) : (
                <>
                  <div className="blog-grid news-grid-wrapper">
                    <AnimatePresence mode="popLayout">
                      {paginatedNews.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: (i % itemsPerPage) * 0.1 }}
                        >
                          <article className="blog-card news-card-item">
                            <Link to={`/news/${item.id}`} className="news-card-link-wrapper">
                              <div className="blog-card-img-wrapper news-card-img-wrapper">
                                {item.image_url ? (
                                  <AsyncImage
                                    src={item.image_url}
                                    alt={item.title}
                                    className="blog-card-img"
                                    fallbackGradient={gradients[i % gradients.length]}
                                  />
                                ) : (
                                  <PlaceholderImg
                                    className="blog-card-img"
                                    gradient={gradients[i % gradients.length]}
                                    alt={item.title}
                                  />
                                )}
                              </div>
                              <div className="blog-card-content news-card-content">
                                <span className="news-card-date">
                                  {new Date(item.published_at).toLocaleDateString(t.locale || 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                                <h3 className="blog-card-title news-card-title">
                                  {item.title}
                                </h3>
                                <p className="blog-card-excerpt news-card-excerpt">
                                  {item.body_plain}
                                </p>
                                <span className="news-card-cta">
                                  {t.readMore} <Icon name="arrow_forward" size={16} />
                                </span>
                              </div>
                            </Link>
                          </article>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Standard pagination numbers */}
                  {totalPages > 1 && (
                    <div className="blog-pagination" style={{ marginTop: '56px', justifyContent: 'center' }}>
                      <button
                        className="blog-pag-btn"
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        aria-label="Previous Page"
                      >
                        <Icon name="chevron_left" size={20} />
                      </button>

                      {getPageNumbers().map((page, idx) => {
                        if (page === '...') {
                          return (
                            <span key={`ellipses-${idx}`} className="blog-pag-ellipses">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            className={`blog-pag-btn ${safeCurrentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        className="blog-pag-btn"
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage === totalPages}
                        aria-label="Next Page"
                      >
                        <Icon name="chevron_right" size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
