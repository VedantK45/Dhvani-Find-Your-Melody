import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Waves } from 'lucide-react';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-mint/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Soundwave Animation */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center space-x-1 h-32 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="bg-primary w-1 animate-pulse-wave"
            style={{
              height: `${Math.random() * 80 + 20}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Music className="text-primary w-16 h-16 mr-4" />
            <Waves className="text-accent w-12 h-12" />
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-bold text-primary mb-4">
            Dhvani
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-body text-2xl md:text-3xl text-primary/80 font-light"
          >
            Find Your Melody
          </motion.p>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-primary hover:bg-primary/90 text-white font-heading font-medium px-12 py-4 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
        </motion.button>
      </div>

      {/* Musical Notes Decoration */}
      <div className="absolute top-20 right-20 text-primary/20 text-4xl animate-float">♪</div>
      <div className="absolute bottom-40 left-20 text-accent/20 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>♫</div>
      <div className="absolute top-40 left-1/3 text-mint/20 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>♬</div>
    </motion.div>
  );
};

export default IntroPage;