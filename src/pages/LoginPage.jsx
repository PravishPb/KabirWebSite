import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Button, Icon } from '../components/ui';

export default function LoginPage() {
  const { session, toast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, go to admin
  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast(error.message);
    } else {
      toast('Login successful');
      navigate('/admin/blogs');
    }
  };

  return (
    <div className="scheme-1" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Icon name="admin_panel_settings" size={48} style={{ color: 'var(--tahiti-gold)', marginBottom: '16px' }} />
          <h1 className="h4">Admin Login</h1>
          <p className="muted2" style={{ marginTop: '8px' }}>Sign in to manage the KAOT website</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: 'var(--neutral-darkest)', padding: '32px', borderRadius: '16px', border: '1px solid var(--ink-20)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg2)' }}>Email Address</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: '1px solid var(--ink-20)', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
              placeholder="admin@example.com"
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--fg2)' }}>Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: '1px solid var(--ink-20)', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="btn btn-default" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: 'var(--fg2)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="arrow_back" size={16} /> Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}
