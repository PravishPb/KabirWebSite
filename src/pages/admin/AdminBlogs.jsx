import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogs } from '../../hooks/useBlogs';
import { useApp } from '../../context/AppContext';
import { Button, Icon, Badge } from '../../components/ui';
import { useTranslation } from '../../locales/useTranslation';
import './AdminBlogs.css';

export default function AdminBlogs() {
  const { toast } = useApp();
  const t = useTranslation('AdminBlogs');
  const { blogs, loading, addBlog, updateBlog, deleteBlog } = useBlogs();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', excerpt: '' });

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingId(post.id);
      setFormData({ title: post.title, category: post.category || '', excerpt: post.excerpt });
    } else {
      setEditingId(null);
      setFormData({ title: '', category: '', excerpt: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', category: '', excerpt: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingId) {
      const { error } = await updateBlog(editingId, {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt
      });
      if (!error) toast(t.toastUpdateSuccess);
      else toast(t.toastUpdateError);
    } else {
      const { error } = await addBlog({
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        content: '<p>New blog content</p>',
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
      if (!error) toast(t.toastCreateSuccess);
      else toast(t.toastCreateError);
    }
    closeModal();
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const { error } = await deleteBlog(deleteConfirmId);
      if (!error) toast(t.toastDeleteSuccess);
      else toast(t.toastDeleteError);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-blogs-container">
      <div className="admin-header-row">
        <div className="admin-header-text">
          <h1 className="h4">{t.title}</h1>
          <p className="muted2">{t.desc}</p>
        </div>
        <Button className="btn btn-default" onClick={() => handleOpenModal()}>
          <Icon name="add" /> {t.createBlogBtn}
        </Button>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <div className="admin-table-loading">{t.loading}</div>
        ) : blogs.length === 0 ? (
          <div className="admin-table-empty">{t.emptyMessage}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.thTitle}</th>
                <th>{t.thCategory}</th>
                <th className="admin-actions-cell">{t.thActions}</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="admin-table-title">{blog.title}</td>
                  <td>
                    {blog.category ? <Badge>{blog.category}</Badge> : <span className="muted2">—</span>}
                  </td>
                  <td className="admin-actions-cell">
                    <div className="admin-actions-group">
                      <button 
                        onClick={() => handleOpenModal(blog)}
                        className="admin-icon-btn admin-edit-btn"
                        title={t.modalEditTitle}
                      >
                        <Icon name="edit" size={20} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(blog.id)}
                        className="admin-icon-btn admin-delete-btn"
                        title={t.modalDeleteTitle}
                      >
                        <Icon name="delete" size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="admin-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="h5 admin-modal-title">{editingId ? t.modalEditTitle : t.modalCreateTitle}</h2>
              <form onSubmit={handleSave} className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">{t.labelTitle}</label>
                  <input 
                    type="text" 
                    required 
                    className="admin-form-input"
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">{t.labelCategory}</label>
                  <input 
                    type="text" 
                    className="admin-form-input"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">{t.labelExcerpt}</label>
                  <textarea 
                    required 
                    className="admin-form-textarea"
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  />
                </div>
                <div className="admin-form-actions">
                  <Button type="button" className="btn btn-secondary" onClick={closeModal}>{t.btnCancel}</Button>
                  <Button type="submit" className="btn btn-default">{editingId ? t.btnSaveChanges : t.btnCreateBlog}</Button>
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
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="admin-modal-card delete-confirm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-delete-icon-wrapper">
                <Icon name="delete" size={48} />
              </div>
              <h2 className="h5 admin-delete-title">{t.modalDeleteTitle}</h2>
              <p className="muted2 admin-delete-desc">{t.modalDeleteDesc}</p>
              <div className="admin-delete-actions">
                <Button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>{t.btnCancel}</Button>
                <Button type="button" className="btn admin-delete-confirm-btn" onClick={confirmDelete}>{t.btnDelete}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
