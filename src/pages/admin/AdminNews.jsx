import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNews } from '../../hooks/useNews';
import { useNewsFilters } from '../../hooks/useNewsFilters';
import { useApp } from '../../context/AppContext';
import { Button, Icon, AsyncImage, PlaceholderImg, AdminImageUploader, AdminRichTextEditor, EventSearch } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import '../BlogPage.css'; // Reusing pagination styles
import './AdminNews.css';

const gradients = [
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
];

export default function AdminNews() {
  const { toast } = useApp();
  const t = useTranslation('AdminNews');
  const { news, loading, addNews, updateNews, deleteNews } = useNews();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    body_text: '',
    published_at: '',
    image_url: ''
  });

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

  // Filtering Logic
  const { searchQuery, setSearchQuery, filteredNews } = useNewsFilters(processedNews);

  // Pagination Logic
  const itemsPerPage = 9;
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

  const handleOpenModal = (newsObj = null) => {
    if (newsObj) {
      setEditingId(newsObj.id);
      setFormData({
        title: newsObj.title || '',
        body_text: newsObj.body_text || '',
        published_at: newsObj.published_at || '',
        image_url: newsObj.image_url || ''
      });
    } else {
      setEditingId(null);
      // Default to today's date formatted as YYYY-MM-DD
      const todayStr = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        body_text: '',
        published_at: todayStr,
        image_url: ''
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      title: '',
      body_text: '',
      published_at: '',
      image_url: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.published_at || saving) return;

    // Enforce cover image validation (at least one image required)
    if (!formData.image_url.trim()) {
      toast(t.toastImageRequired || 'Cover image is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        body_text: formData.body_text || '',
        published_at: formData.published_at,
        image_url: formData.image_url
      };

      if (editingId) {
        const { error } = await updateNews(editingId, payload);
        if (!error) toast(t.toastUpdateSuccess);
        else toast(t.toastUpdateError);
      } else {
        const { error } = await addNews(payload);
        if (!error) toast(t.toastCreateSuccess);
        else toast(t.toastCreateError);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      toast(t.toastError);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmId && !saving) {
      setSaving(true);
      try {
        const { error } = await deleteNews(deleteConfirmId);
        if (!error) toast(t.toastDeleteSuccess);
        else toast(t.toastDeleteError);
        setDeleteConfirmId(null);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="admin-news-container">
      <div className="admin-header-row">
        <div className="admin-header-text">
          <h1 className="h4">{t.title}</h1>
          <p className="muted2">{t.desc}</p>
        </div>
        <Button className="btn btn-default" onClick={() => handleOpenModal()}>
          <Icon name="add" /> {t.createNewsBtn}
        </Button>
      </div>

      <div className="admin-news-content">
        {news.length > 0 && (
          <EventSearch 
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder={t.searchPlaceholder}
          />
        )}

        {loading ? (
          <div className="admin-table-loading">{t.loading}</div>
        ) : news.length === 0 ? (
          <div className="admin-table-empty">{t.emptyMessage}</div>
        ) : filteredNews.length === 0 ? (
          <div className="admin-table-empty">{t.noMatchingNews}</div>
        ) : (
          <>
            <motion.div className="blog-grid admin-news-grid" layout>
              <AnimatePresence mode="popLayout">
                {paginatedNews.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <article className="blog-card admin-news-card">
                      <div className="blog-card-img-wrapper admin-news-card-img-wrapper">
                        {item.image_url ? (
                          <AsyncImage
                            src={item.image_url}
                            alt={item.title}
                            className="blog-card-img admin-news-card-img"
                            fallbackGradient={gradients[i % gradients.length]}
                          />
                        ) : (
                          <PlaceholderImg
                            className="blog-card-img admin-news-card-img"
                            gradient={gradients[i % gradients.length]}
                            alt={item.title}
                          />
                        )}
                      </div>
                      <div className="blog-card-content admin-news-card-content">
                        <h3 className="blog-card-title admin-news-card-title">{item.title}</h3>
                        <p className="blog-card-excerpt admin-news-card-excerpt">
                          {item.body_plain}
                        </p>
                        
                        <div className="blog-card-meta-secondary admin-news-card-meta">
                          <span className="admin-news-meta-item">
                            <Icon name="event" size={14} />
                            <span>
                              {item.published_at
                                ? new Date(item.published_at).toLocaleDateString(t.locale || 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : ''}
                            </span>
                          </span>
                        </div>

                        {/* Admin Operations Actions Footer */}
                        <div className="admin-card-actions admin-news-card-actions">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }} 
                            className="btn btn-secondary admin-news-btn-action"
                          >
                            <Icon name="edit" size={16} /> {t.btnEdit || 'Edit'}
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }} 
                            className="btn btn-secondary admin-news-btn-delete"
                          >
                            <Icon name="delete" size={16} /> {t.btnDelete}
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

      {/* News Create / Edit Modal */}
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
              className="admin-modal-card news-edit-modal"
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

                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">{t.labelDate}</label>
                    <input 
                      type="date" 
                      required 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.published_at} 
                      onChange={e => setFormData({...formData, published_at: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminImageUploader
                      label={t.labelImageUrl}
                      value={formData.image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                      storageBucket="news-images" 
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminRichTextEditor
                      label={t.labelBody}
                      value={formData.body_text}
                      onChange={(val) => setFormData(prev => ({ ...prev, body_text: val }))}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="admin-form-actions">
                  <Button type="button" className="btn btn-secondary" onClick={saving ? undefined : closeModal} disabled={saving}>{t.btnCancel}</Button>
                  <Button type="submit" className="btn btn-default" disabled={saving}>
                    {saving ? t.labelSaving : (editingId ? t.btnSaveChanges : t.btnCreateNews)}
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
                  {saving ? t.labelDeleting : t.btnDelete}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
