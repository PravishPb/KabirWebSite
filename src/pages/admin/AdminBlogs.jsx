import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogs } from '../../hooks/useBlogs';
import { useApp } from '../../context/AppContext';
import { Button, Icon, Badge, AsyncImage, PlaceholderImg, AdminImageUploader, AdminRichTextEditor } from '../../components/ui';
import BlogFilters from '../../components/ui/BlogFilters';
import useBlogFilters from '../../hooks/useBlogFilters';
import { useTranslation } from '../../locales/useTranslation';
import '../BlogPage.css';
import './AdminBlogs.css';

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
  'linear-gradient(135deg, #234c2e 0%, #6b8f75 100%)',
  'linear-gradient(135deg, #2a3138 0%, #6a7b8c 100%)',
];

export default function AdminBlogs() {
  const { lang, toast } = useApp();
  const t = useTranslation('AdminBlogs');
  const { blogs, loading, addBlog, updateBlog, deleteBlog } = useBlogs();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  // Filters & Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    author: 'Association',
    categories: '',
    image_url: '',
    excerpt: '',
    content: '',
    slug: '',
    published_at: ''
  });

  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const processedBlogs = blogs.map(p => ({
    ...p,
    title: p.title ? decodeHTML(p.title) : '',
    excerpt_plain: p.excerpt ? decodeHTML(p.excerpt).replace(/<[^>]+>/g, '') : 'Read more...',
    excerpt: p.excerpt || '',
    categories: Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : (p.category ? [p.category] : ['KAOT Posts'])
  }));
  const filters = useBlogFilters(processedBlogs);
  const { filteredPosts: filteredBlogs } = filters;

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedBlogs = filteredBlogs.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // Scroll to top on page change
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

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingId(post.id);
      const categoriesStr = Array.isArray(post.categories) ? post.categories.join(', ') : '';
      let formattedDate = '';
      if (post.published_at) {
        const d = new Date(post.published_at);
        const tzOffset = d.getTimezoneOffset() * 60000;
        formattedDate = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
      }
      setFormData({
        title: post.title || '',
        author: post.author || 'Association',
        categories: categoriesStr,
        image_url: post.image_url || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        slug: post.slug || '',
        published_at: formattedDate
      });
    } else {
      setEditingId(null);
      const d = new Date();
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
      setFormData({
        title: '',
        author: 'Association',
        categories: '',
        image_url: '',
        excerpt: '',
        content: '',
        slug: '',
        published_at: localISOTime
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      author: 'Association',
      categories: '',
      image_url: '',
      excerpt: '',
      content: '',
      slug: '',
      published_at: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || saving) return;

    setSaving(true);
    try {
      const categoriesArray = formData.categories
        ? formData.categories.split(',').map(c => c.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        author: formData.author || 'Association',
        categories: categoriesArray,
        image_url: formData.image_url || null,
        excerpt: formData.excerpt,
        content: formData.content || '',
        slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()
      };

      if (editingId) {
        const { error } = await updateBlog(editingId, payload);
        if (!error) toast(t.toastUpdateSuccess);
        else toast(t.toastUpdateError);
      } else {
        const { error } = await addBlog(payload);
        if (!error) toast(t.toastCreateSuccess);
        else toast(t.toastCreateError);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      toast(lang === 'HI' ? 'त्रुटि हुई' : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmId && !saving) {
      setSaving(true);
      try {
        const { error } = await deleteBlog(deleteConfirmId);
        if (!error) toast(t.toastDeleteSuccess);
        else toast(t.toastDeleteError);
        setDeleteConfirmId(null);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="admin-blogs-container">
      <div className="admin-header-row" style={{ marginBottom: '24px' }}>
        <div className="admin-header-text">
          <h1 className="h4">{t.title}</h1>
          <p className="muted2">{t.desc}</p>
        </div>
        <Button className="btn btn-default" onClick={() => handleOpenModal()}>
          <Icon name="add" /> {t.createBlogBtn}
        </Button>
      </div>

      {/* Search & Filter Panel */}
      {!modalOpen && !deleteConfirmId && (
        <div style={{ marginBottom: '32px' }}>
          <BlogFilters filters={filters} onFilterChange={() => setCurrentPage(1)} />
        </div>
      )}

      {/* Blogs Grid View (Matches BlogPage.jsx exactly but with Admin Action Buttons) */}
      <div className="admin-blogs-content">
        {loading ? (
          <div className="admin-table-loading">{t.loading}</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="admin-table-empty">{t.emptyMessage}</div>
        ) : (
          <>
            <motion.div className="blog-grid" layout>
              <AnimatePresence mode="popLayout">
                {paginatedBlogs.map((blog, i) => (
                  <motion.div 
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <article className="blog-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'default' }}>
                      <div className="blog-card-img-wrapper">
                        {blog.image_url ? (
                          <AsyncImage
                            src={blog.image_url}
                            alt={blog.title}
                            className="blog-card-img"
                            fallbackGradient={gradients[i % gradients.length]}
                          />
                        ) : (
                          <PlaceholderImg
                            className="blog-card-img"
                            gradient={gradients[i % gradients.length]}
                            alt={blog.title}
                          />
                        )}
                      </div>
                      <div className="blog-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div className="blog-card-meta" style={{ flexWrap: 'wrap', gap: '8px' }}>
                          {blog.categories.slice(0, 2).map((cat, idx) => (
                            <Badge key={idx}>{cat}</Badge>
                          ))}
                          {blog.categories.length > 2 && <Badge>+{blog.categories.length - 2}</Badge>}
                          <span className="blog-card-readtime">5 min read</span>
                        </div>
                        
                        <h3 className="blog-card-title" style={{ fontSize: '1.25rem', margin: '8px 0 4px 0', lineBreak: 'anywhere' }}>{blog.title}</h3>
                        <p className="blog-card-excerpt" style={{ fontSize: '0.92rem', color: 'var(--fg2)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '4px 0 12px 0' }}>
                          {blog.excerpt_plain}
                        </p>
                        
                        <div className="blog-card-meta-secondary" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--fg2)', marginTop: 'auto', marginBottom: '12px' }}>
                          <span className="blog-card-author" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="person" size={14} />
                            <span>{blog.author || 'Association'}</span>
                          </span>
                          <span className="blog-card-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="calendar_today" size={14} />
                            <span>
                              {blog.published_at
                                ? new Date(blog.published_at).toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : ''}
                            </span>
                          </span>
                        </div>

                        {/* Admin Operations Actions Footer */}
                        <div className="admin-card-actions" style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(blog); }} 
                            className="btn btn-secondary"
                            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', justifyContent: 'center' }}
                          >
                            <Icon name="edit" size={16} /> {t.modalEditTitle || 'Edit'}
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(blog.id); }} 
                            className="btn btn-secondary"
                            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', justifyContent: 'center', color: '#ff4d4f', borderColor: 'rgba(255,77,79,0.2)' }}
                          >
                            <Icon name="delete" size={16} /> {t.btnDelete || 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </article>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="blog-pagination" style={{ marginTop: '40px', justifyContent: 'center' }}>
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

      {/* Blog Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="admin-modal-card blog-edit-modal"
            >
              <div className="admin-modal-header">
                <h2 className="h5 admin-modal-title">{editingId ? t.modalEditTitle : t.modalCreateTitle}</h2>
                <button type="button" className="admin-modal-close-btn" onClick={closeModal} disabled={saving} aria-label="Close">
                  <Icon name="close" size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="admin-form">
                <div className="admin-form-grid">
                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">{t.labelTitle}</label>
                    <input 
                      type="text" 
                      required 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">{t.labelAuthor}</label>
                    <input 
                      type="text" 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.author} 
                      onChange={e => setFormData({...formData, author: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">{t.labelCategories}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Congregation, Teachings"
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.categories} 
                      onChange={e => setFormData({...formData, categories: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminImageUploader
                      label={t.labelImageUrl || 'Blog Image'}
                      value={formData.image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                      storageBucket="blog-images"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">{t.labelSlug}</label>
                    <input 
                      type="text" 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.slug} 
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">{t.labelPublishedAt}</label>
                    <input 
                      type="datetime-local" 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.published_at} 
                      onChange={e => setFormData({...formData, published_at: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminRichTextEditor
                      label={t.labelExcerpt || 'Excerpt'}
                      value={formData.excerpt}
                      onChange={(val) => setFormData(prev => ({ ...prev, excerpt: val }))}
                      disabled={saving}
                      placeholder="Write a short summary..."
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminRichTextEditor
                      label={t.labelContent || 'Content'}
                      value={formData.content}
                      onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                      disabled={saving}
                      placeholder="Write the full post content..."
                    />
                  </div>
                </div>

                <div className="admin-form-actions">
                  <Button type="button" className="btn btn-secondary" onClick={saving ? undefined : closeModal} disabled={saving}>{t.btnCancel}</Button>
                  <Button type="submit" className="btn btn-default" disabled={saving}>
                    {saving ? (lang === 'HI' ? 'सहेज रहे हैं...' : 'Saving...') : (editingId ? t.btnSaveChanges : t.btnCreateBlog)}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="admin-modal-card delete-confirm"
            >
              <button type="button" className="admin-modal-close-btn absolute-close" onClick={saving ? undefined : () => setDeleteConfirmId(null)} disabled={saving} aria-label="Close">
                <Icon name="close" size={24} />
              </button>
              <div className="admin-delete-icon-wrapper">
                <Icon name="delete" size={48} />
              </div>
              <h2 className="h5 admin-delete-title">{t.modalDeleteTitle}</h2>
              <p className="muted2 admin-delete-desc">{t.modalDeleteDesc}</p>
              <div className="admin-delete-actions">
                <Button type="button" className="btn btn-secondary" onClick={saving ? undefined : () => setDeleteConfirmId(null)} disabled={saving}>{t.btnCancel}</Button>
                <Button type="button" className="btn admin-delete-confirm-btn" onClick={confirmDelete} disabled={saving}>
                  {saving ? (lang === 'HI' ? 'हटा रहे हैं...' : 'Deleting...') : t.btnDelete}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
