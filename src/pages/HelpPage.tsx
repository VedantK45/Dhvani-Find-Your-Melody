import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Shield, Mail, Brain, Music, Sparkles } from 'lucide-react';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/mood-detection')}
            className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">
            Help & Support
          </h1>
        </div>

        <div className="space-y-8">
          {/* How It Works */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Brain className="w-8 h-8 text-primary mr-3" />
              <h2 className="font-heading text-2xl font-semibold text-primary">
                How Mood Detection Works
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-primary mb-2">1. Capture</h3>
                <p className="font-body text-primary/70 text-sm">
                  We access your camera to capture your current expression
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-primary mb-2">2. Analyze</h3>
                <p className="font-body text-primary/70 text-sm">
                  Our system suggests a mood based on the moment
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-primary mb-2">3. Suggest</h3>
                <p className="font-body text-primary/70 text-sm">
                  Get personalized music recommendations that match your mood
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h2 className="font-heading text-2xl font-semibold text-primary">
                Privacy & Security
              </h2>
            </div>
            
            <div className="space-y-4 font-body text-primary/80">
              <p>Your privacy is our top priority. Here's how we protect your data:</p>
              
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Camera data is processed locally and never stored</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Mood detection happens in your browser without external servers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Only mood results are saved to improve your experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>All data is stored locally and can be deleted at any time</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-semibold text-primary mb-2">
                  How does the mood detection work?
                </h3>
                <p className="font-body text-primary/70">
                  The app uses your camera to capture the moment and suggests a mood. It's designed to be fun and help you discover new music!
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-primary mb-2">
                  Can I use this without a camera?
                </h3>
                <p className="font-body text-primary/70">
                  Camera access is required for the mood detection feature. If you prefer not to use the camera, you can manually browse the music suggestions.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-primary mb-2">
                  How do you choose the songs?
                </h3>
                <p className="font-body text-primary/70">
                  We use curated playlists and popular songs that match different moods to provide you with great music recommendations.
                </p>
              </div>
              
              <div>
                <h3 className="font-heading font-semibold text-primary mb-2">
                  Is my data shared with third parties?
                </h3>
                <p className="font-body text-primary/70">
                  No, we never share your personal data. Everything happens locally in your browser for complete privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Mail className="w-8 h-8 text-primary mr-3" />
              <h2 className="font-heading text-2xl font-semibold text-primary">
                Get in Touch
              </h2>
            </div>
            
            <p className="font-body text-primary/70 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            
            <a
              href="mailto:support@dhvani.app"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-heading font-medium px-6 py-3 rounded-full transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              support@dhvani.app
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpPage;