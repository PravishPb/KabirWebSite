import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../../hooks/useEvents';
import { useEventFilters } from '../../hooks/useEventFilters';
import { useApp } from '../../context/AppContext';
import { Button, Icon, AsyncImage, PlaceholderImg, AdminImageUploader, AdminRichTextEditor, EventSearch } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import '../BlogPage.css'; // Reusing pagination styles
import './AdminEvents.css';

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
  'linear-gradient(135deg, #234c2e 0%, #6b8f75 100%)',
  'linear-gradient(135deg, #2a3138 0%, #6a7b8c 100%)',
];

export default function AdminEvents() {
  const { toast } = useApp();
  const t = useTranslation('AdminEvents');
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    event_time: '',
    image_url: ''
  });

  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const processedEvents = events.map(p => ({
    ...p,
    title: p.title ? decodeHTML(p.title) : '',
    description_plain: p.description ? decodeHTML(p.description).replace(/<[^>]+>/g, '') : '',
    description: p.description || ''
  }));

  // Filtering Logic
  const { searchQuery, setSearchQuery, filteredEvents } = useEventFilters(processedEvents);

  // Pagination Logic
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedEvents = filteredEvents.slice(
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

  const handleOpenModal = (eventObj = null) => {
    if (eventObj) {
      setEditingId(eventObj.id);
      setFormData({
        title: eventObj.title || '',
        description: eventObj.description || '',
        location: eventObj.location || '',
        event_date: eventObj.event_date || '',
        event_time: eventObj.event_time || '',
        image_url: eventObj.image_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        event_date: '',
        event_time: '',
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
      description: '',
      location: '',
      event_date: '',
      event_time: '',
      image_url: ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.event_date || saving) return;

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || '',
        location: formData.location || '',
        event_date: formData.event_date,
        event_time: formData.event_time || null,
        image_url: formData.image_url || null
      };

      if (editingId) {
        const { error } = await updateEvent(editingId, payload);
        if (!error) toast(t.toastUpdateSuccess);
        else toast(t.toastUpdateError);
      } else {
        const { error } = await addEvent(payload);
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
        const { error } = await deleteEvent(deleteConfirmId);
        if (!error) toast(t.toastDeleteSuccess);
        else toast(t.toastDeleteError);
        setDeleteConfirmId(null);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="admin-events-container">
      <div className="admin-header-row">
        <div className="admin-header-text">
          <h1 className="h4">{t.title}</h1>
          <p className="muted2">{t.desc}</p>
        </div>
        <Button className="btn btn-default" onClick={() => handleOpenModal()}>
          <Icon name="add" /> {t.createEventBtn}
        </Button>
      </div>

      <div className="admin-events-content">
        {events.length > 0 && (
          <EventSearch 
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder={t.searchPlaceholder}
          />
        )}

        {loading ? (
          <div className="admin-table-loading">{t.loading}</div>
        ) : events.length === 0 ? (
          <div className="admin-table-empty">{t.emptyMessage}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="admin-table-empty">{t.noMatchingEvents}</div>
        ) : (
          <>
            <motion.div className="blog-grid admin-events-grid" layout>
              <AnimatePresence mode="popLayout">
                {paginatedEvents.map((ev, i) => (
                  <motion.div 
                    key={ev.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <article className="blog-card admin-event-card">
                      <div className="blog-card-img-wrapper admin-event-card-img-wrapper">
                        {ev.image_url ? (
                          <AsyncImage
                            src={ev.image_url}
                            alt={ev.title}
                            className="blog-card-img admin-event-card-img"
                            fallbackGradient={gradients[i % gradients.length]}
                          />
                        ) : (
                          <PlaceholderImg
                            className="blog-card-img admin-event-card-img"
                            gradient={gradients[i % gradients.length]}
                            alt={ev.title}
                          />
                        )}
                      </div>
                      <div className="blog-card-content admin-event-card-content">
                        <h3 className="blog-card-title admin-event-card-title">{ev.title}</h3>
                        <p className="blog-card-excerpt admin-event-card-excerpt">
                          {ev.description_plain}
                        </p>
                        
                        <div className="blog-card-meta-secondary admin-event-card-meta">
                          <span className="admin-event-meta-item">
                            <Icon name="event" size={14} />
                            <span>
                              {ev.event_date
                                ? new Date(ev.event_date).toLocaleDateString(t.locale || 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : ''}
                            </span>
                          </span>
                          {ev.event_time && (
                            <span className="admin-event-meta-item">
                              <Icon name="schedule" size={14} />
                              <span>{ev.event_time.slice(0, 5)}</span>
                            </span>
                          )}
                          {ev.location && (
                            <span className="admin-event-meta-item-full">
                              <Icon name="location_on" size={14} />
                              <span>{ev.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Admin Operations Actions Footer */}
                        <div className="admin-card-actions admin-event-card-actions">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleOpenModal(ev); }} 
                            className="btn btn-secondary admin-event-btn-action"
                          >
                            <Icon name="edit" size={16} /> {t.modalEditTitle}
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(ev.id); }} 
                            className="btn btn-secondary admin-event-btn-delete"
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

      {/* Event Create / Edit Modal */}
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
              className="admin-modal-card event-edit-modal"
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
                    <label className="admin-form-label">{t.labelDate}</label>
                    <input 
                      type="date" 
                      required 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.event_date} 
                      onChange={e => setFormData({...formData, event_date: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">{t.labelTime}</label>
                    <input 
                      type="time" 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.event_time} 
                      onChange={e => setFormData({...formData, event_time: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label className="admin-form-label">{t.labelLocation}</label>
                    <input 
                      type="text" 
                      disabled={saving}
                      className="admin-form-input"
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminImageUploader
                      label={t.labelImageUrl}
                      value={formData.image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                      storageBucket="event-images" 
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <AdminRichTextEditor
                      label={t.labelDescription}
                      value={formData.description}
                      onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="admin-form-actions">
                  <Button type="button" className="btn btn-secondary" onClick={saving ? undefined : closeModal} disabled={saving}>{t.btnCancel}</Button>
                  <Button type="submit" className="btn btn-default" disabled={saving}>
                    {saving ? t.labelSaving : (editingId ? t.btnSaveChanges : t.btnCreateEvent)}
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
