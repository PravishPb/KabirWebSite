import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, toast } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast('Error logging out');
    } else {
      toast('Logged out successfully');
      navigate('/login');
    }
  };

  return (
    <div className="admin-layout scheme-1">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Icon name="admin_panel_settings" size={32} style={{ color: 'var(--tahiti-gold)' }} />
          <div className="admin-title">
            <span style={{ fontWeight: 600 }}>KAOT</span> Admin
          </div>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin/blogs" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Icon name="article" size={20} />
            <span>Blogs</span>
          </NavLink>
          {/* Future Modules */}
          <div className="admin-nav-item disabled" title="Coming soon">
            <Icon name="people" size={20} />
            <span>Users (Soon)</span>
          </div>
          <div className="admin-nav-item disabled" title="Coming soon">
            <Icon name="library_books" size={20} />
            <span>Library (Soon)</span>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <Icon name="account_circle" size={20} />
            <span style={{ fontSize: '14px', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
            <Icon name="open_in_new" size={18} />
            View Live Site
          </a>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
