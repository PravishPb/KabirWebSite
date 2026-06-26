import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AppProvider } from './context/AppContext';

import './styles/tokens.css';
import './styles/kit.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import ProtectedRoute from './components/ProtectedRoute';

// Lazy load admin pages for security and performance
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const AdminBlogs = React.lazy(() => import('./pages/admin/AdminBlogs'));

// Lazy load pages for performance optimization
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const TeachingsPage = React.lazy(() => import('./pages/TeachingsPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const LibraryBhajans = React.lazy(() => import('./pages/library/LibraryBhajans'));
const SakhisPage = React.lazy(() => import('./pages/library/SakhisPage'));
const PrayersPage = React.lazy(() => import('./pages/library/PrayersPage'));
const DrJDasPage = React.lazy(() => import('./pages/library/DrJDasPage'));
const ReligiousHorizonsPage = React.lazy(() => import('./pages/library/ReligiousHorizonsPage'));
const PictorialGlimpsesPage = React.lazy(() => import('./pages/library/PictorialGlimpsesPage'));
const AudioVideoFilesPage = React.lazy(() => import('./pages/library/AudioVideoFilesPage'));
const TransliterationPage = React.lazy(() => import('./pages/TransliterationPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const DivyaDrishtiPage = React.lazy(() => import('./pages/library/DivyaDrishtiPage'));
const HoliSammelanPage = React.lazy(() => import('./pages/library/HoliSammelanPage'));
const KabirNightPage = React.lazy(() => import('./pages/library/KabirNightPage'));
const JeevanDarshanPage = React.lazy(() => import('./pages/satguru/JeevanDarshanPage'));
const JeevanDarshanCategoryPage = React.lazy(() => import('./pages/satguru/JeevanDarshanCategoryPage'));
const SatguruKabirSahebPage = React.lazy(() => import('./pages/satguru/SatguruKabirSahebPage'));
const ChowkaPage = React.lazy(() => import('./pages/events/ChowkaPage'));
const PerformancesPage = React.lazy(() => import('./pages/events/PerformancesPage'));
const VisitsPage = React.lazy(() => import('./pages/events/VisitsPage'));
const KabirCenterPage = React.lazy(() => import('./pages/events/KabirCenterPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));

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
                <Route path="/library/sakhis" element={<SakhisPage />} />
                <Route path="/library/divya-drishti" element={<DivyaDrishtiPage />} />
                <Route path="/library/prayers" element={<PrayersPage />} />
                <Route path="/library/dr-j-das" element={<DrJDasPage />} />
                <Route path="/library/religious-horizons" element={<ReligiousHorizonsPage />} />
                <Route path="/library/pictorial-glimpses" element={<PictorialGlimpsesPage />} />
                <Route path="/library/audio-video-files" element={<AudioVideoFilesPage />} />
                <Route path="/library/transliteration" element={<TransliterationPage />} />
                <Route path="/library/holi-sammelan" element={<HoliSammelanPage />} />
                <Route path="/library/kabir-night" element={<KabirNightPage />} />
                <Route path="/satguru/jeevan-darshan" element={<JeevanDarshanPage />} />
                <Route path="/satguru/jeevan-darshan/:category" element={<JeevanDarshanCategoryPage />} />
                <Route path="/satgurukabirsaheb" element={<SatguruKabirSahebPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/chowka" element={<ChowkaPage />} />
                <Route path="/events/performances" element={<PerformancesPage />} />
                <Route path="/events/visits" element={<VisitsPage />} />
                <Route path="/kabircenter" element={<KabirCenterPage />} />
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
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
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
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}

