import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute() {
  const { session } = useApp();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!session) {
      setAuthorized(false);
      setChecking(false);
      return;
    }

    const checkMfaLevel = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (error) throw error;

        // If they have enrolled factors (nextLevel === 'aal2'), but haven't solved the challenge (currentLevel === 'aal1')
        if (data.nextLevel === 'aal2' && data.currentLevel === 'aal1') {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error('MFA guard check failed:', err);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    checkMfaLevel();
  }, [session]);

  // If no session exists, redirect to login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (checking) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Verifying security session...</div>;
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and passed MFA challenge (or MFA not enrolled), render the child routes
  return <Outlet />;
}
