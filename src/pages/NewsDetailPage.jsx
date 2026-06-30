import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { useTranslation } from '../locales/useTranslation';
import { Icon, AsyncImage, PlaceholderImg } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import './NewsDetailPage.css';

export default function NewsDetailPage() {
  const { id } = useParams();
  const t = useTranslation('NewsDetailPage');
  const { news, loading } = useNews();

  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const currentItem = news.find((n) => n.id === id);

  if (loading) {
    return (
      <div className="page-content news-detail-loading">
        <div className="container">
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="page-content news-detail-not-found">
        <div className="container center">
          <Icon name="error" size={48} className="news-error-icon" />
          <h2 className="h4">{t.notFound}</h2>
          <Link to="/news" className="btn btn-secondary news-back-btn">
            <Icon name="arrow_back" /> {t.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const titleDecoded = decodeHTML(currentItem.title);
  const bodyDecoded = currentItem.body_text || '';

  return (
    <div className="page-content news-detail-page-wrapper">
      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            {/* Back button */}
            <div className="news-detail-nav">
              <Link to="/news" className="news-back-link">
                <Icon name="arrow_back" size={18} /> <span>{t.backToList}</span>
              </Link>
            </div>

            {/* Header info */}
            <header className="news-detail-header">
              <span className="news-detail-date">
                {t.publishedOn}: {new Date(currentItem.published_at).toLocaleDateString(t.locale || 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <h1 className="h2 news-detail-title">{titleDecoded}</h1>
            </header>

            {/* Banner image */}
            <div className="news-detail-banner">
              {currentItem.image_url ? (
                <img
                  src={currentItem.image_url}
                  alt={titleDecoded}
                  className="news-detail-banner-img"
                />
              ) : (
                <PlaceholderImg
                  className="news-detail-banner-img"
                  gradient="linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)"
                  alt={titleDecoded}
                />
              )}
            </div>

            {/* Rich text body content */}
            {bodyDecoded && (
              <div
                className="prose news-detail-body"
                dangerouslySetInnerHTML={{ __html: bodyDecoded }}
              />
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
