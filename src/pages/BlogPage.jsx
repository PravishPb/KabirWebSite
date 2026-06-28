import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Eyebrow, ChevronLink, AsyncImage, PlaceholderImg, Icon } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import BlogFilters from '../components/ui/BlogFilters';
import useBlogFilters from '../hooks/useBlogFilters';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../locales/useTranslation';
import { useBlogs } from '../hooks/useBlogs';
import { useDynamicFonts } from '../hooks/useDynamicFonts';
import './BlogPage.css';

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
  'linear-gradient(135deg, #234c2e 0%, #6b8f75 100%)',
  'linear-gradient(135deg, #2a3138 0%, #6a7b8c 100%)',
];

export default function BlogPage() {
  const { lang } = useApp();
  const t = useTranslation('BlogPage');
  
  const { blogs: livePosts, loading } = useBlogs();
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const readId = searchParams.get('read');

  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const currentPosts = React.useMemo(() => livePosts.map(p => ({
    id: p.id,
    categories: Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : ['KAOT']),
    author: p.author || (lang === 'HI' ? 'एसोसिएशन' : 'Association'),
    comment_count: p.comment_count || 0,
    read: '5 min read',
    title: p.title ? decodeHTML(p.title) : '',
    excerpt: p.excerpt ? decodeHTML(p.excerpt).replace(/<[^>]+>/g, '') : 'Read more...',
    content: p.content,
    image_url: p.image_url,
    published_at: p.published_at
  })), [livePosts, lang]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const filters = useBlogFilters(currentPosts);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [readId]);

  const cleanLegacyLinks = (html) => {
    if (!html) return '';
    let cleaned = html;
    
    // 1. Strip responsive image sizes (srcset/sizes) so browser is forced to load the high-res src from Supabase
    cleaned = cleaned.replace(/srcset=["'][^"']+["']/gi, '');
    cleaned = cleaned.replace(/sizes=["'][^"']+["']/gi, '');

    // 2. Clean content images (rewriting legacy uploads to Supabase storage URL)
    const bucketBaseUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://tywdvuwnudlekiosgbps.supabase.co'}/storage/v1/object/public/blog-images/`;
    const imgRegex = /src=["']((?:https?:\/\/(?:www\.)?kabirassociationoftoronto\.org)?\/?wp-content\/uploads\/[^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const fullUrl = match[1];
      try {
        const parts = fullUrl.split('/');
        const filename = parts[parts.length - 1];
        const newUrl = bucketBaseUrl + filename;
        cleaned = cleaned.replaceAll(fullUrl, newUrl);
      } catch (e) {}
    }

    // 2. Replace base domain with empty string to make them root-relative paths
    cleaned = cleaned.replace(/https?:\/\/(?:www\.)?kabirassociationoftoronto\.org\/?/gi, '/');
    
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
        navigate(href);
      }
    }
  };

  // Removed currentPosts from here as it's been moved up

  // Extract unique categories dynamically from posts
  const { filteredPosts, selectedCategory } = filters;

  const selectedPost = currentPosts.find(p => String(p.id) === String(readId));

  // Dynamically load Google Fonts used in the rich text content
  useDynamicFonts(selectedPost?.content);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedPosts = filteredPosts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    setTimeout(() => {
      const section = document.getElementById('blog-grid-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handlePostClick = (postId) => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('filter', selectedCategory);
    }
    params.set('read', postId);
    navigate(`/blog?${params.toString()}`);
  };

  const handleBack = () => {
    if (selectedCategory && selectedCategory !== 'All') {
      navigate(`/blog?filter=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate('/blog');
    }
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

  // If reading a specific blog post, render detail view
  if (selectedPost) {
    const publishedDate = selectedPost.published_at
      ? new Date(selectedPost.published_at).toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';

    return (
      <div className="page-content blog-page-detail" style={{ position: 'relative' }}>
        <section className="section scheme-3">
          <div className="container">
            <AnimatedSection>
              <div className="blog-detail-container">
                {/* Back Button */}
                <button className="blog-detail-back-btn" onClick={handleBack}>
                  <Icon name="arrow_back" size={18} />
                  <span>{lang === 'HI' ? 'ब्लॉग सूची पर वापस जाएं' : 'Back to blogs'}</span>
                </button>

                {/* Header Info */}
                <div className="blog-detail-header">
                  <div className="blog-detail-meta" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    {selectedPost.categories.map(cat => (
                      <Badge key={cat}>{cat}</Badge>
                    ))}
                    {publishedDate && <span className="blog-detail-date">{publishedDate}</span>}
                    <span className="blog-read">{selectedPost.read}</span>
                  </div>
                  <h1 className="blog-detail-title">{selectedPost.title}</h1>
                </div>

                {/* Banner Image */}
                <div className="blog-detail-banner">
                  {selectedPost.image_url ? (
                    <img
                      src={selectedPost.image_url}
                      alt={selectedPost.title}
                      className="blog-detail-banner-img"
                    />
                  ) : (
                    <div 
                      className="blog-detail-banner-img"
                      style={{ 
                        background: gradients[currentPosts.indexOf(selectedPost) % gradients.length],
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  )}
                </div>

                {/* Article Content */}
                <div 
                  className="blog-detail-content"
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{ __html: cleanLegacyLinks(selectedPost.content) }}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    );
  }

  // Render Grid View of Blogs
  return (
    <div className="page-content" style={{ position: 'relative' }}>
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center" style={{ marginInline: 'auto' }}>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1">{t.h1}</h1>
              <p className="lead" style={{ marginTop: '20px' }}>
                {t.lead}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3" id="blog-grid-section">
        <div className="container">
          {/* Search & Filter Panel - Always Visible */}
          {!loading && <BlogFilters filters={filters} onFilterChange={() => setCurrentPage(1)} />}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--fg2)' }}>Loading blogs...</div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--fg2)', marginTop: '20px' }}>
              {lang === 'HI' ? 'कोई ब्लॉग नहीं मिला।' : 'No blog posts found.'}
            </div>
          ) : (
            <>
              <motion.div className="blog-grid" layout>
                <AnimatePresence mode="popLayout">
                  {paginatedPosts.map((post, i) => (
                    <motion.div 
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <article 
                        className="blog-card" 
                        onClick={() => handlePostClick(post.id)}
                      >
                        <div className="blog-card-img-wrapper">
                          {post.image_url ? (
                            <AsyncImage
                              src={post.image_url}
                              alt={post.title}
                              className="blog-card-img"
                              fallbackGradient={gradients[i % gradients.length]}
                            />
                          ) : (
                            <PlaceholderImg
                              className="blog-card-img"
                              gradient={gradients[i % gradients.length]}
                              alt={post.title}
                            />
                          )}
                        </div>
                        <div className="blog-card-content">
                          <div className="blog-card-meta" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            {post.categories.slice(0, 2).map((cat, idx) => (
                              <Badge key={idx}>{cat}</Badge>
                            ))}
                            {post.categories.length > 2 && <Badge>+{post.categories.length - 2}</Badge>}
                            <span className="blog-card-readtime">{post.read}</span>
                          </div>
                          
                          <h3 className="blog-card-title">{post.title}</h3>
                          <p className="blog-card-excerpt">{post.excerpt}</p>
                          
                          <div className="blog-card-meta-secondary" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--fg2)', marginTop: 'auto', marginBottom: '0.5rem' }}>
                            <span className="blog-card-author" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="person" size={14} />
                              <span>{post.author}</span>
                            </span>
                            <span className="blog-card-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="calendar_today" size={14} />
                              <span>
                                {post.published_at
                                  ? new Date(post.published_at).toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : ''}
                              </span>
                            </span>
                            <span className="blog-card-comments" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="chat_bubble_outline" size={14} />
                              <span>{post.comment_count} {lang === 'HI' ? 'टिप्पणियाँ' : 'Comments'}</span>
                            </span>
                          </div>

                          <ChevronLink 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePostClick(post.id);
                            }}
                            style={{ marginTop: '1rem' }}
                          >
                            {t.readMore}
                          </ChevronLink>
                        </div>
                      </article>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination UI Controls */}
              {totalPages > 1 && (
                <div className="blog-pagination">
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
        </div>
      </section>
    </div>
  );
}
