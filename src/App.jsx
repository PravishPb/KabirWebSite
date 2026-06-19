import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AppProvider } from './context/AppContext';

import './styles/tokens.css';
import './styles/kit.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminBlogs from './pages/admin/AdminBlogs';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for performance optimization
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const TeachingsPage = React.lazy(() => import('./pages/TeachingsPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const LibraryBhajans = React.lazy(() => import('./pages/library/LibraryBhajans'));
const PrayersPage = React.lazy(() => import('./pages/library/PrayersPage'));
const TransliterationPage = React.lazy(() => import('./pages/TransliterationPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4,
};

function PublicLayout() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/teachings" element={<TeachingsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/library/bhajans" element={<LibraryBhajans />} />
                <Route path="/library/prayers" element={<PrayersPage />} />
                <Route path="/library/transliteration" element={<TransliterationPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route path="/*" element={<PublicLayout />} />
          
          {/* Admin Routes without public Navbar/Footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="blogs" replace />} />
              <Route path="blogs" element={<AdminBlogs />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

