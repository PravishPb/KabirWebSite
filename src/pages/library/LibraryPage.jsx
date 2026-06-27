import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { Eyebrow, Icon } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import booksData from '../../data/books.json';
import './LibraryPage.css';

export default function LibraryPage() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Translations
  const t = {
    EN: {
      eyebrow: 'Publications & Literature',
      title: 'Library of Kabir Literature',
      subtitle: 'Explore translations, commentaries, and devotional works of Satguru Kabir Saheb.',
      price: 'Price',
      shipping: 'Shipping',
      copies: 'Available Copies',
      isbn: 'ISBN',
      buyNow: 'Buy Now',
      buyOnAmazon: 'Buy on Amazon',
      close: 'Close',
      details: 'Book Details',
      toc: 'Book Gallery',
      noBooks: 'No books found.',
      purchaseNote: 'Books are shipped globally. Clicking "Buy Now" will redirect you to PayPal to complete your purchase safely.',
      authorContact: 'Author Contact'
    },
    HI: {
      eyebrow: 'प्रकाशन और साहित्य',
      title: 'कबीर साहित्य पुस्तकालय',
      subtitle: 'सतगुरु कबीर साहेब के अनुवादों, टीकाओं और भक्ति रचनाओं का अन्वेषण करें।',
      price: 'कीमत',
      shipping: 'शिपिंग',
      copies: 'उपलब्ध प्रतियां',
      isbn: 'आई.एस.बी.एन.',
      buyNow: 'अभी खरीदें',
      buyOnAmazon: 'अमेज़न पर खरीदें',
      close: 'बंद करें',
      details: 'पुस्तक विवरण',
      toc: 'पुस्तक गैलरी',
      noBooks: 'कोई पुस्तक नहीं मिली।',
      purchaseNote: 'पुस्तकें विश्व स्तर पर भेजी जाती हैं। "अभी खरीदें" पर क्लिक करने से आप सुरक्षित रूप से अपनी खरीद पूरी करने के लिए पेपाल पर रीडायरेक्ट हो जाएंगे।',
      authorContact: 'लेखक संपर्क'
    }
  }[lang] || {
    eyebrow: 'Publications & Literature',
    title: 'Library of Kabir Literature',
    subtitle: 'Explore translations, commentaries, and devotional works of Satguru Kabir Saheb.',
    price: 'Price',
    shipping: 'Shipping',
    copies: 'Available Copies',
    isbn: 'ISBN',
    buyNow: 'Buy Now',
    buyOnAmazon: 'Buy on Amazon',
    close: 'Close',
    details: 'Book Details',
    toc: 'Book Gallery',
    noBooks: 'No books found.',
    purchaseNote: 'Books are shipped globally. Clicking "Buy Now" will redirect you to PayPal to complete your purchase safely.',
    authorContact: 'Author Contact'
  };

  const handleOpenBook = (book) => {
    setSelectedBook(book);
    setActiveImageIdx(0);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
    document.body.style.overflow = 'auto';
  };

  const cleanLegacyLinks = (html) => {
    if (!html) return '';
    let cleaned = html;
    
    // Replace base domain with empty string to make them root-relative paths
    cleaned = cleaned.replace(/https?:\/\/(?:www\.)?kabirassociationoftoronto\.(?:org|com)\/?/gi, '/');
    
    // Run replacements for specific pages
    const urlMapping = {
      '/sakhis': '/library/sakhis',
      '/audio-and-video-files': '/library/audio-video-files',
      '/pictorial-glimpses': '/library/pictorial-glimpses',
      '/religious-horizons': '/library/religious-horizons',
      '/dr-j-das': '/library/dr-j-das',
      '/holi-sammelan': '/library/holi-sammelan',
      '/kabir-night': '/library/kabir-night',
      '/jeevan-darshan-life': '/satguru/jeevan-darshan/life',
      '/jeevan-darshan-baawan-kasni': '/satguru/jeevan-darshan/baawan-kasni',
      '/jeevan-darshan-short-stories': '/satguru/jeevan-darshan/short-stories',
      '/jeevan-darshan-disciples-and-famous-followers': '/satguru/jeevan-darshan/disciples',
      '/chowka': '/events/chowka',
      '/performances': '/events/performances',
      '/visits': '/events/visits',
      '/kabir-center': '/kabircenter',
      '/contact-us': '/contact',
      '/kabir-association-of-toronto': '/about',
      '/blog': '/blog',
      '/transliteration-hindi-to-english': '/library/transliteration',
      '/bhajans': '/library/bhajans',
      '/satguru-kabir-saheb': '/teachings',
      '/prayers-and-devotional-hymns': '/library/prayers'
    };

    Object.entries(urlMapping).forEach(([oldPath, newPath]) => {
      const escapedPath = oldPath.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      const regex1 = new RegExp(`href=["']${escapedPath}/?([\?"'])`, 'gi');
      cleaned = cleaned.replace(regex1, `href="${newPath}$1`);
      
      const regex2 = new RegExp(`href=["']${escapedPath}/?(#|\\?|$)`, 'gi');
      cleaned = cleaned.replace(regex2, `href="${newPath}$1`);
    });
    
    cleaned = cleaned.replace(/href=["']\/\/+/gi, 'href="/');
    
    return cleaned;
  };

  const handleContentClick = (e) => {
    const target = e.target.closest('a');
    if (target && target.getAttribute('href')) {
      const href = target.getAttribute('href');
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        handleCloseBook(); // Close modal on redirect to make transition smooth
        navigate(href);
      }
    }
  };

  return (
    <div className="page-content library-books-page">
      {/* Hero Header */}
      <section className="section scheme-2 text-center library-books-hero">
        <div className="container">
          <AnimatedSection>
            <div className="prose mx-auto">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1" style={{ marginBottom: '1rem' }}>{t.title}</h1>
              <p className="lead muted2">{t.subtitle}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Books Grid */}
      <section className="section scheme-3">
        <div className="container">
          <AnimatedSection>
            <div className="books-grid-layout">
              {booksData.map((book, idx) => {
                const coverImage = book.images && book.images.length > 0 
                  ? book.images[0] 
                  : '/images/books/placeholder.jpg';
                  
                return (
                  <motion.div 
                    key={idx}
                    className="book-card-container"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={() => handleOpenBook(book)}
                  >
                    <div className="book-card-cover-wrap">
                      <img src={coverImage} alt={book.title} className="book-card-cover" />
                      <div className="book-card-hover-overlay">
                        <span className="book-card-view-btn">
                          <Icon name="visibility" size={18} />
                          <span>Quick View</span>
                        </span>
                      </div>
                    </div>
                    <div className="book-card-info">
                      <h3 className="book-card-title">{book.title}</h3>
                      <div className="book-card-meta">
                        <span className="book-card-price">{book.price}</span>
                        {book.isbn && <span className="book-card-isbn">ISBN: {book.isbn}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            className="book-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseBook}
          >
            <motion.div 
              className="book-modal-card scheme-3"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button" 
                className="book-modal-close-btn" 
                onClick={handleCloseBook}
                aria-label={t.close}
              >
                <Icon name="close" size={24} />
              </button>

              <div className="book-modal-content-grid">
                {/* Left Column: Image Viewer */}
                <div className="book-modal-viewer">
                  <div className="book-modal-main-image-wrap">
                    <img 
                      src={selectedBook.images[activeImageIdx]} 
                      alt={`${selectedBook.title} - View ${activeImageIdx + 1}`} 
                      className="book-modal-main-image"
                    />
                  </div>
                  
                  {/* Thumbnails Gallery */}
                  {selectedBook.images.length > 1 && (
                    <div className="book-modal-thumbs">
                      {selectedBook.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`book-modal-thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                          onClick={() => setActiveImageIdx(idx)}
                        >
                          <img src={img} alt={`Thumb ${idx + 1}`} className="book-modal-thumb-img" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Book Details */}
                <div className="book-modal-details">
                  <h2 className="h4 book-modal-title">{selectedBook.title}</h2>
                  
                  {/* Metadata Specs */}
                  <div className="book-modal-specs">
                    {selectedBook.price && (
                      <div className="spec-item">
                        <span className="spec-label">{t.price}</span>
                        <span className="spec-value highlight">{selectedBook.price}</span>
                      </div>
                    )}
                    {selectedBook.shipping && (
                      <div className="spec-item">
                        <span className="spec-label">{t.shipping}</span>
                        <span className="spec-value">{selectedBook.shipping}</span>
                      </div>
                    )}
                    {selectedBook.copies && (
                      <div className="spec-item">
                        <span className="spec-label">{t.copies}</span>
                        <span className="spec-value">{selectedBook.copies}</span>
                      </div>
                    )}
                    {selectedBook.isbn && (
                      <div className="spec-item">
                        <span className="spec-label">{t.isbn}</span>
                        <span className="spec-value">{selectedBook.isbn}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="book-modal-description" onClick={handleContentClick}>
                    <h3 className="spec-label" style={{ marginBottom: '8px' }}>{t.details}</h3>
                    <div 
                      className="book-desc-content"
                      dangerouslySetInnerHTML={{ __html: cleanLegacyLinks(selectedBook.desc) }} 
                    />
                  </div>

                  {/* Author Contact */}
                  {selectedBook.authorContact && (
                    <div className="book-modal-author-contact">
                      <h3 className="spec-label" style={{ marginBottom: '4px' }}>{t.authorContact}</h3>
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>
                        <a href={`mailto:${selectedBook.authorContact}`} style={{ color: 'var(--tahiti-gold)', textDecoration: 'underline' }}>
                          {selectedBook.authorContact}
                        </a>
                      </p>
                    </div>
                  )}

                  {/* Purchase CTA */}
                  <div className="book-modal-purchase-action">
                    {selectedBook.paypalButtonId ? (
                      <div className="paypal-checkout-block">
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                          <input type="hidden" name="cmd" value="_s-xclick" />
                          <input type="hidden" name="hosted_button_id" value={selectedBook.paypalButtonId} />
                          <button type="submit" className="btn btn-default book-buy-btn">
                            <Icon name="shopping_cart" />
                            <span>{t.buyNow}</span>
                          </button>
                        </form>
                        <p className="purchase-note">{t.purchaseNote}</p>
                      </div>
                    ) : selectedBook.buyUrl ? (
                      <div className="amazon-checkout-block">
                        <a 
                          href={selectedBook.buyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-default book-buy-btn amazon"
                        >
                          <Icon name="open_in_new" />
                          <span>{t.buyOnAmazon}</span>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
