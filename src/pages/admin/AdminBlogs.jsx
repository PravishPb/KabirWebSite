import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogs } from '../../hooks/useBlogs';
import { useApp } from '../../context/AppContext';
import { Button, Icon, Badge } from '../../components/ui';

export default function AdminBlogs() {
  const { toast } = useApp();
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
      if (!error) toast('Blog updated successfully');
      else toast('Error updating blog');
    } else {
      const { error } = await addBlog({
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        content: '<p>New blog content</p>',
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
      if (!error) toast('Blog created successfully');
      else toast('Error creating blog');
    }
    closeModal();
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const { error } = await deleteBlog(deleteConfirmId);
      if (!error) toast('Blog deleted successfully');
      else toast('Error deleting blog');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="h4" style={{ marginBottom: '8px' }}>Blog Management</h1>
          <p className="muted2">Create, edit, and delete public blog posts.</p>
        </div>
        <Button className="btn btn-default" onClick={() => handleOpenModal()}>
          <Icon name="add" /> Create Blog
        </Button>
      </div>

      <div style={{ background: 'var(--neutral-darkest)', border: '1px solid var(--ink-20)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg2)' }}>Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg2)' }}>No blogs found. Create one to get started.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink-20)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--fg2)', fontSize: '0.875rem' }}>Title</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--fg2)', fontSize: '0.875rem' }}>Category</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--fg2)', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id} style={{ borderBottom: '1px solid var(--ink-20)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{blog.title}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {blog.category ? <Badge>{blog.category}</Badge> : <span style={{color: 'var(--fg3)'}}>—</span>}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenModal(blog)}
                        style={{ background: 'transparent', border: 0, color: 'var(--tahiti-gold)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Icon name="edit" size={20} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(blog.id)}
                        style={{ background: 'transparent', border: 0, color: '#ff4d4f', cursor: 'pointer', padding: '4px' }}
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

      {/* Reusing the generic modal styles from BlogPage.css for now, or creating inline for simplicity */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ background: 'var(--neutral-darkest)', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '32px', border: '1px solid var(--ink-20)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="h5" style={{ marginBottom: '24px' }}>{editingId ? 'Edit Blog' : 'Create Blog'}</h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg2)' }}>Title</label>
                  <input 
                    type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: '1px solid var(--ink-20)', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg2)' }}>Category</label>
                  <input 
                    type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: '1px solid var(--ink-20)', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg2)' }}>Excerpt</label>
                  <textarea 
                    required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: '1px solid var(--ink-20)', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <Button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" className="btn btn-default">{editingId ? 'Save Changes' : 'Create Blog'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ background: 'var(--neutral-darkest)', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '32px', border: '1px solid var(--ink-20)', textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ color: '#ff4d4f', marginBottom: '16px' }}><Icon name="delete" size={48} /></div>
              <h2 className="h5" style={{ marginBottom: '12px' }}>Delete Blog</h2>
              <p className="muted2" style={{ marginBottom: '32px' }}>Are you sure you want to delete this blog? This action cannot be undone.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button type="button" style={{ background: '#ff4d4f', color: '#fff' }} className="btn" onClick={confirmDelete}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
