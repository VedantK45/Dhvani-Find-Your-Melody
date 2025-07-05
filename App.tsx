import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import IntroPage from './pages/IntroPage';
import AuthPage from './pages/AuthPage';
import MoodDetectionPage from './pages/MoodDetectionPage';
import SongSuggestionPage from './pages/SongSuggestionPage';
import HelpPage from './pages/HelpPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-secondary via-mint/20 to-primary/10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/mood-detection" element={<MoodDetectionPage />} />
              <Route path="/songs" element={<SongSuggestionPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;