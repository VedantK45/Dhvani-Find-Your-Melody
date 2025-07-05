import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, Clock, Smile, Trash2, RefreshCw } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, clearHistory } = useApp();

  const getMostCommonMood = () => {
    if (state.moodHistory.length === 0) return 'N/A';
    
    const moodCounts = state.moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const entries = Object.entries(moodCounts);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'N/A';
  };

  const getThisWeekCount = () => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return state.moodHistory.filter(entry => {
      // Parse the date string (format: "24 Jun 2025")
      const [day, month, year] = entry.date.split(' ');
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const entryDate = new Date(parseInt(year), monthMap[month], parseInt(day));
      return entryDate >= weekAgo && entryDate <= now;
    }).length;
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all mood history? This action cannot be undone.')) {
      clearHistory();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/mood-detection')}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
            >
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">
                Your Mood History
              </h1>
              <p className="font-body text-primary/70 mt-2">
                Track your emotional journey over time
              </p>
            </div>
          </div>
          
          {/* Clear History Button */}
          {state.moodHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              title="Clear all history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-2">
              <Smile className="w-6 h-6 text-primary mr-2" />
              <h3 className="font-heading font-semibold text-primary">Total Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{state.moodHistory.length}</p>
            <p className="text-sm text-primary/60 mt-1">
              {state.moodHistory.length === 0 ? 'No sessions yet' : 
               state.moodHistory.length === 1 ? 'mood detection' : 'mood detections'}
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-6 h-6 text-primary mr-2" />
              <h3 className="font-heading font-semibold text-primary">This Week</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{getThisWeekCount()}</p>
            <p className="text-sm text-primary/60 mt-1">
              {getThisWeekCount() === 0 ? 'No activity this week' : 'recent sessions'}
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-2">
              <Clock className="w-6 h-6 text-primary mr-2" />
              <h3 className="font-heading font-semibold text-primary">Most Common</h3>
            </div>
            <p className="text-3xl font-bold text-primary capitalize">
              {getMostCommonMood()}
            </p>
            <p className="text-sm text-primary/60 mt-1">
              {state.moodHistory.length === 0 ? 'No data available' : 'dominant mood'}
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-semibold text-primary">
              Recent Mood Detections
            </h2>
            {state.moodHistory.length > 0 && (
              <span className="font-body text-sm text-primary/60">
                {state.moodHistory.length} {state.moodHistory.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>
          
          {state.moodHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-primary/5 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Smile className="w-12 h-12 text-primary/30" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                No mood history yet
              </h3>
              <p className="font-body text-primary/70 mb-6 max-w-md mx-auto">
                Start detecting your mood to see your emotional journey over time. Each detection will be automatically saved here.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mood-detection')}
                className="bg-primary hover:bg-primary/90 text-white font-heading font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Detect Your First Mood</span>
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.moodHistory.map((entry, index) => (
                <motion.div
                  key={`${entry.date}-${entry.time}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{entry.emoji}</div>
                    <div>
                      <h3 className="font-heading font-semibold text-primary capitalize">
                        {entry.mood}
                      </h3>
                      <p className="font-body text-primary/70 text-sm">
                        Feeling {entry.mood.toLowerCase()} at this moment
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-body text-primary font-medium">{entry.date}</p>
                    <p className="font-body text-primary/70 text-sm">{entry.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mood-detection')}
            className="bg-primary hover:bg-primary/90 text-white font-heading font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Detect New Mood
          </motion.button>
          
          {state.moodHistory.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/songs')}
              className="bg-white/80 hover:bg-white text-primary font-heading font-medium px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-primary/20"
            >
              View Current Songs
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPage;