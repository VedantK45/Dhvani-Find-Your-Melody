import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Music, User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Waves, Volume2, Shield, AlertCircle, CheckCircle, Info } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, login, state, clearAuthError } = useApp();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation states
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Clear auth error when component mounts or mode changes
  useEffect(() => {
    clearAuthError();
    setShowSuccessMessage(false);
  }, [isLogin, clearAuthError]);

  // Clear form when switching modes
  const handleModeSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({ username: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowSuccessMessage(false);
    clearAuthError();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = { username: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Username validation (only for sign up)
    if (!isLogin) {
      if (!username.trim()) {
        newErrors.username = 'Username is required';
        isValid = false;
      } else if (username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
        isValid = false;
      }
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation (only for sign up)
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email.trim(), password);
        if (success) {
          setSuccessMessage(`Welcome back! 🎵`);
          setShowSuccessMessage(true);
          
          // Navigate after showing success message
          setTimeout(() => {
            navigate('/mood-detection');
          }, 2000);
        }
      } else {
        success = await signUp(username.trim(), email.trim(), password);
        if (success) {
          setSuccessMessage(`Welcome to Dhvani, ${username.trim()}! Let's find your perfect melody! 🎶`);
          setShowSuccessMessage(true);
          
          // Navigate after showing success message
          setTimeout(() => {
            navigate('/mood-detection');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isFormValid = (isLogin || username.trim().length >= 3) && 
                     validateEmail(email) && 
                     password.length >= 6 && 
                     (isLogin || password === confirmPassword);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated Musical Background */}
      <div className="absolute inset-0 z-0">
        {/* Floating Musical Notes */}
        <motion.div
          animate={{ 
            y: [-20, -40, -20],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-primary/20 text-6xl"
        >
          ♪
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [20, 40, 20],
            rotate: [0, -15, 15, 0],
            scale: [1, 0.9, 1.2, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 right-32 text-accent/30 text-5xl"
        >
          ♫
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Volume2 className="w-8 h-8 text-primary/30" />
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [0, -25, 0],
            y: [0, 15, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-1/2 right-1/3 w-12 h-12 bg-mint/15 rounded-lg flex items-center justify-center"
        >
          <Waves className="w-6 h-6 text-mint/40" />
        </motion.div>
      </div>

      {/* Main Form Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative z-10">
        <div className="text-center">
          <motion.div 
            className="flex justify-center mb-6"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-primary/10 p-4 rounded-full">
              <Music className="text-primary w-12 h-12" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="font-heading text-3xl font-bold text-primary mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Welcome to Dhvani
          </motion.h2>
          <p className="font-body text-primary/70 mb-6">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>

          {/* Mode Toggle */}
          <div className="flex bg-primary/10 rounded-full p-1 mb-8">
            <button
              onClick={() => handleModeSwitch(false)}
              className={`flex-1 py-2 px-4 rounded-full font-heading font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                !isLogin 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
            <button
              onClick={() => handleModeSwitch(true)}
              className={`flex-1 py-2 px-4 rounded-full font-heading font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLogin 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm font-body">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {state.authError && !showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-body">{state.authError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username Input (Sign Up only) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-primary/50" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) {
                          setErrors(prev => ({ ...prev, username: '' }));
                        }
                      }}
                      onKeyDown={handleKeyPress}
                      placeholder="Username"
                      autoComplete="username"
                      className={`w-full pl-12 pr-4 py-4 bg-white/50 border-2 rounded-xl font-body text-primary placeholder-primary/50 focus:outline-none focus:bg-white/70 transition-all duration-300 ${
                        errors.username 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-primary/20 focus:border-primary/60'
                      }`}
                      disabled={isLoading || showSuccessMessage}
                    />
                  </div>
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 text-left"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary/50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Email address"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-4 bg-white/50 border-2 rounded-xl font-body text-primary placeholder-primary/50 focus:outline-none focus:bg-white/70 transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-primary/20 focus:border-primary/60'
                  }`}
                  disabled={isLoading || showSuccessMessage}
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 text-left"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary/50" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={`w-full pl-12 pr-12 py-4 bg-white/50 border-2 rounded-xl font-body text-primary placeholder-primary/50 focus:outline-none focus:bg-white/70 transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-primary/20 focus:border-primary/60'
                  }`}
                  disabled={isLoading || showSuccessMessage}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  disabled={isLoading || showSuccessMessage}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-primary/50 hover:text-primary/70" />
                  ) : (
                    <Eye className="h-5 w-5 text-primary/50 hover:text-primary/70" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 text-left"
                >
                  {errors.password}
                </motion.p>
              )}
              
              {/* Password Requirements for Sign Up */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-start space-x-2"
                >
                  <Info className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                  <p className="text-primary/60 text-xs font-body">
                    Password should be minimum 6 characters
                  </p>
                </motion.div>
              )}
            </div>

            {/* Confirm Password Input (Sign Up only) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-primary/50" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      onKeyDown={handleKeyPress}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      className={`w-full pl-12 pr-4 py-4 bg-white/50 border-2 rounded-xl font-body text-primary placeholder-primary/50 focus:outline-none focus:bg-white/70 transition-all duration-300 ${
                        errors.confirmPassword 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-primary/20 focus:border-primary/60'
                      }`}
                      disabled={isLoading || showSuccessMessage}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2 text-left"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: (isFormValid && !showSuccessMessage) ? 1.02 : 1 }}
            whileTap={{ scale: (isFormValid && !showSuccessMessage) ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading || showSuccessMessage}
            className={`w-full font-heading font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-md mt-6 ${
              isFormValid && !isLoading && !showSuccessMessage
                ? 'bg-primary hover:bg-primary/90 text-white hover:shadow-lg cursor-pointer'
                : 'bg-primary/30 text-primary/50 cursor-not-allowed'
            }`}
          >
            {isLoading || state.isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
              </>
            ) : showSuccessMessage ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span>{isLogin ? 'Sign In' : 'Let\'s Go'}</span>
              </>
            )}
          </motion.button>

          {/* Privacy Notice */}
          <div className="mt-6 space-y-2">
            <p className="font-body text-sm text-primary/50">
              Your data is securely stored in the cloud with Firebase.
            </p>
            {!isLogin && (
              <p className="font-body text-xs text-primary/40">
                By signing up, you agree to our terms of service.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;