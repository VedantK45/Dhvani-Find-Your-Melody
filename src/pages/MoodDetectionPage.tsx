import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { moodDetectionService, FaceDetectionResult, LockedFaceData } from '../services/moodDetectionService';
import { 
  Scroll, 
  HelpCircle, 
  LogOut, 
  Camera, 
  Play, 
  Sparkles, 
  Music, 
  AlertTriangle, 
  User, 
  RefreshCw, 
  Brain,
  Zap,
  Eye,
  CheckCircle,
  Shield,
  Star,
  Lock,
  Unlock,
  Timer,
  Clock
} from 'lucide-react';

const MoodDetectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, logout, setMood } = useApp();
  const [isDetecting, setIsDetecting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [faceDetection, setFaceDetection] = useState<FaceDetectionResult>({ 
    faceDetected: false, 
    confidence: 0, 
    faceCount: 0,
    isHuman: false,
    faceQuality: 'poor',
    detectionMethod: 'Initializing'
  });
  const [isCheckingFace, setIsCheckingFace] = useState(false);
  const [lockedFace, setLockedFace] = useState<LockedFaceData | null>(null);
  const [isLockingFace, setIsLockingFace] = useState(false);
  const [showLockSuccess, setShowLockSuccess] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lockCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const emotions = ['happy', 'sad', 'energetic', 'relaxed', 'surprised', 'angry', 'neutral'];
  const emotionEmojis = { 
    happy: '😊', 
    sad: '😢', 
    energetic: '⚡', 
    relaxed: '😌', 
    surprised: '😲', 
    angry: '😠', 
    neutral: '😐' 
  };

  useEffect(() => {
    startCamera();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    // Start continuous face detection when camera is ready
    if (cameraStream && !cameraError && !isInitializing) {
      startFaceDetection();
      startLockCheck();
    }
    
    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
      if (lockCheckIntervalRef.current) {
        clearInterval(lockCheckIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [cameraStream, cameraError, isInitializing]);

  // Real-time timer effect for locked face
  useEffect(() => {
    if (lockedFace) {
      // Start real-time timer
      startRealTimeTimer();
    } else {
      // Stop timer when no locked face
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setLockTimeRemaining(0);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [lockedFace]);

  const startRealTimeTimer = () => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Update timer every 100ms for smooth countdown
    timerIntervalRef.current = setInterval(() => {
      if (lockedFace) {
        const elapsed = Date.now() - lockedFace.timestamp;
        const remaining = Math.max(0, 30000 - elapsed); // 30 seconds in milliseconds
        const remainingSeconds = Math.ceil(remaining / 1000);
        
        setLockTimeRemaining(remainingSeconds);

        // Auto-clear when expired
        if (remaining <= 0) {
          handleClearLock();
        }
      }
    }, 100); // Update every 100ms for smooth animation
  };

  const cleanup = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
    }
    if (lockCheckIntervalRef.current) {
      clearInterval(lockCheckIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const startCamera = async () => {
    try {
      setIsInitializing(true);
      setCameraError(null);
      
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 20 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play();
          setTimeout(() => {
            setIsInitializing(false);
          }, 1500);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsInitializing(false);
      handleCameraError(error);
    }
  };

  const startFaceDetection = () => {
    if (!videoRef.current || faceDetectionIntervalRef.current) return;

    setIsCheckingFace(true);
    
    // Check for human faces every 800ms for better accuracy
    faceDetectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && !isDetecting && !isLockingFace) {
        try {
          const result = await moodDetectionService.detectFace(videoRef.current);
          setFaceDetection(result);
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }
    }, 800);
  };

  const startLockCheck = () => {
    // Check for locked face status every 2 seconds
    lockCheckIntervalRef.current = setInterval(() => {
      const lockedFaceInfo = moodDetectionService.getLockedFaceInfo();
      setLockedFace(lockedFaceInfo);
    }, 2000);
  };

  const handleCameraError = (error: any) => {
    if (error.name === 'NotAllowedError') {
      setCameraError('Camera access denied. Please allow camera permissions and refresh the page.');
    } else if (error.name === 'NotFoundError') {
      setCameraError('No camera found. Please connect a camera and try again.');
    } else if (error.name === 'NotReadableError') {
      setCameraError('Camera is being used by another application. Please close other apps and try again.');
    } else {
      setCameraError('Camera initialization failed. Please check your camera and try again.');
    }
  };

  const handleLockFace = async () => {
    if (!videoRef.current || !faceDetection.faceDetected || !faceDetection.isHuman) {
      return;
    }

    setIsLockingFace(true);
    
    try {
      const success = await moodDetectionService.lockFace(videoRef.current, faceDetection);
      
      if (success) {
        setShowLockSuccess(true);
        setTimeout(() => setShowLockSuccess(false), 3000);
        
        // Update locked face info
        const lockedFaceInfo = moodDetectionService.getLockedFaceInfo();
        setLockedFace(lockedFaceInfo);
        
        // Stop continuous face detection since we have a locked face
        if (faceDetectionIntervalRef.current) {
          clearInterval(faceDetectionIntervalRef.current);
          faceDetectionIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.error('Face locking failed:', error);
    } finally {
      setIsLockingFace(false);
    }
  };

  const handleClearLock = () => {
    moodDetectionService.clearLockedFace();
    setLockedFace(null);
    setLockTimeRemaining(0);
    
    // Stop the timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Restart face detection
    if (!faceDetectionIntervalRef.current) {
      startFaceDetection();
    }
  };

  const handleMoodDetection = async () => {
    if (!videoRef.current) {
      return;
    }

    // If we have a locked face, use it directly
    if (lockedFace) {
      setIsDetecting(true);
      setShowResult(false);

      try {
        // Show detection animation
        const shuffleDuration = 2000;
        const shuffleInterval = 150;
        const shuffleSteps = shuffleDuration / shuffleInterval;

        let step = 0;
        const shuffle = setInterval(() => {
          setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
          step++;

          if (step >= shuffleSteps) {
            clearInterval(shuffle);
            
            // Use locked face for mood detection
            moodDetectionService.detectMoodFromLockedFace().then(result => {
              setCurrentEmotion(result.emotion);
              setMood(result.emotion);
              setIsDetecting(false);
              setShowResult(true);

              // Navigate to songs after showing result
              setTimeout(() => {
                navigate('/songs');
              }, 4000);
            }).catch(error => {
              console.error('Mood detection failed:', error);
              setIsDetecting(false);
            });
          }
        }, shuffleInterval);
      } catch (error) {
        console.error('Mood detection failed:', error);
        setIsDetecting(false);
      }
      return;
    }

    // Otherwise, require face detection first
    if (!faceDetection.faceDetected || !faceDetection.isHuman) {
      return;
    }

    setIsDetecting(true);
    setShowResult(false);

    try {
      // Show detection animation
      const shuffleDuration = 2000;
      const shuffleInterval = 150;
      const shuffleSteps = shuffleDuration / shuffleInterval;

      let step = 0;
      const shuffle = setInterval(() => {
        setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
        step++;

        if (step >= shuffleSteps) {
          clearInterval(shuffle);
          
          // Get final mood detection using the current face detection result
          moodDetectionService.detectMoodFromVideo(videoRef.current!, faceDetection).then(result => {
            setCurrentEmotion(result.emotion);
            setMood(result.emotion);
            setIsDetecting(false);
            setShowResult(true);

            // Update locked face info if face was locked during detection
            if (result.usedLockedFace) {
              const lockedFaceInfo = moodDetectionService.getLockedFaceInfo();
              setLockedFace(lockedFaceInfo);
            }

            // Navigate to songs after showing result
            setTimeout(() => {
              navigate('/songs');
            }, 4000);
          }).catch(error => {
            console.error('Mood detection failed:', error);
            setIsDetecting(false);
          });
        }
      }, shuffleInterval);
    } catch (error) {
      console.error('Mood detection failed:', error);
      setIsDetecting(false);
    }
  };

  const handleRetryCamera = () => {
    cleanup();
    setCameraStream(null);
    setCameraError(null);
    setFaceDetection({ 
      faceDetected: false, 
      confidence: 0, 
      faceCount: 0,
      isHuman: false,
      faceQuality: 'poor',
      detectionMethod: 'Initializing'
    });
    setLockedFace(null);
    setLockTimeRemaining(0);
    moodDetectionService.clearLockedFace();
    startCamera();
  };

  const handleLogout = () => {
    moodDetectionService.clearLockedFace();
    logout();
    navigate('/');
  };

  const canLockFace = () => {
    return !cameraError && !isInitializing && cameraStream && 
           faceDetection.faceDetected && faceDetection.isHuman && 
           faceDetection.faceQuality !== 'poor' && !lockedFace && !isLockingFace;
  };

  const canDetectMood = () => {
    if (lockedFace) return true; // Can always detect mood with locked face
    
    return !cameraError && !isInitializing && cameraStream && 
           faceDetection.faceDetected && faceDetection.isHuman && 
           faceDetection.faceQuality !== 'poor';
  };

  const getButtonText = () => {
    if (lockedFace) return "Detect My Mood";
    if (isInitializing) return 'Initializing...';
    if (cameraError) return 'Fix Camera First';
    if (!faceDetection.faceDetected) return 'Position Your Face';
    if (!faceDetection.isHuman) return 'Human Face Required';
    if (faceDetection.faceQuality === 'poor') return 'Improve Face Quality';
    return "What's My Mood?";
  };

  const getFaceDetectionStatus = () => {
    if (lockedFace) {
      return `Face locked (${lockTimeRemaining}s remaining, ${lockedFace.quality} quality)`;
    }
    if (cameraError) return 'Camera Error';
    if (isInitializing) return 'Initializing camera...';
    if (isCheckingFace && !faceDetection.faceDetected) return 'Scanning for human faces...';
    if (faceDetection.faceDetected && !faceDetection.isHuman) return 'Non-human face detected';
    if (faceDetection.faceDetected && faceDetection.isHuman) {
      const confidence = Math.round(faceDetection.confidence * 100);
      return `Human face detected (${confidence}% confidence, ${faceDetection.faceQuality} quality)`;
    }
    return 'Position your face in the camera';
  };

  const getFaceDetectionColor = () => {
    if (lockedFace) return 'bg-purple-500';
    if (cameraError) return 'bg-red-500';
    if (isInitializing || isCheckingFace) return 'bg-yellow-500';
    if (faceDetection.faceDetected && !faceDetection.isHuman) return 'bg-orange-500';
    if (faceDetection.faceDetected && faceDetection.isHuman) {
      if (faceDetection.faceQuality === 'excellent') return 'bg-green-500';
      if (faceDetection.faceQuality === 'good') return 'bg-blue-500';
      if (faceDetection.faceQuality === 'fair') return 'bg-yellow-600';
      return 'bg-orange-500';
    }
    return 'bg-gray-500';
  };

  const getFaceQualityIcon = () => {
    if (lockedFace) return <Lock className="w-4 h-4 text-white" />;
    if (faceDetection.faceQuality === 'excellent') return <Star className="w-4 h-4 text-white" />;
    if (faceDetection.faceQuality === 'good') return <CheckCircle className="w-4 h-4 text-white" />;
    if (faceDetection.faceQuality === 'fair') return <Eye className="w-4 h-4 text-white" />;
    return <User className="w-4 h-4 text-white" />;
  };

  const getQualityMessage = () => {
    if (lockedFace) {
      return `🔒 Face locked! Using ${lockedFace.quality} quality face for mood detection`;
    }
    
    if (!faceDetection.faceDetected) return null;
    
    if (!faceDetection.isHuman) {
      return '🤖 Please ensure only human faces are in view';
    }
    
    switch (faceDetection.faceQuality) {
      case 'excellent':
        return '✨ Perfect! Ready to lock face for mood detection';
      case 'good':
        return '👍 Good quality face detected - ready to lock';
      case 'fair':
        return '💡 Fair quality - can lock but try improving lighting';
      case 'poor':
        return '⚠️ Please improve lighting and face positioning';
      default:
        return null;
    }
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (lockTimeRemaining > 20) return 'text-green-600';
    if (lockTimeRemaining > 10) return 'text-yellow-600';
    if (lockTimeRemaining > 5) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get timer background color
  const getTimerBgColor = () => {
    if (lockTimeRemaining > 20) return 'bg-green-500/90';
    if (lockTimeRemaining > 10) return 'bg-yellow-500/90';
    if (lockTimeRemaining > 5) return 'bg-orange-500/90';
    return 'bg-red-500/90';
  };

  // Calculate progress percentage for timer
  const getTimerProgress = () => {
    return (lockTimeRemaining / 30) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      {/* Header */}
      <div className="absolute top-6 right-6 z-20 flex space-x-4">
        <button
          onClick={() => navigate('/history')}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Scroll className="w-6 h-6 text-primary" />
        </button>
        <button
          onClick={() => navigate('/help')}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <HelpCircle className="w-6 h-6 text-primary" />
        </button>
        <button
          onClick={handleLogout}
          className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <LogOut className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Detection Method Indicator */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {lockedFace ? 'Face Locked Mode' : faceDetection.detectionMethod}
            </span>
          </div>
        </div>
      </div>

      {/* Lock Success Message */}
      <AnimatePresence>
        {showLockSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30"
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-heading font-semibold text-green-700">Face Locked Successfully!</p>
                  <p className="text-sm text-green-600">Ready for accurate mood detection</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="flex items-center justify-between w-full max-w-7xl">
          {/* Welcome Message - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 pr-12 max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-primary">
                  Welcome back, {state.user.username}!
                </h2>
              </div>
              
              <div className="space-y-4 font-body text-primary/80">
                <p className="text-lg leading-relaxed">
                  Ready to discover the perfect soundtrack for your current mood? 
                </p>
                
                <div className="bg-primary/5 rounded-2xl p-4 mt-6">
                  <div className="flex items-center mb-3">
                    <Lock className="w-5 h-5 text-primary mr-2" />
                    <span className="font-heading font-semibold text-primary">
                      Face Lock Technology:
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-accent mr-2 mt-1">1.</span>
                      <span>Position your face clearly in the camera view</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2 mt-1">2.</span>
                      <span>Lock your face for consistent mood detection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2 mt-1">3.</span>
                      <span>Use locked face for accurate mood analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2 mt-1">4.</span>
                      <span>Get personalized music recommendations</span>
                    </li>
                  </ul>
                </div>
                
                {/* Enhanced Face Detection Status */}
                <div className="bg-white/50 rounded-xl p-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getFaceDetectionColor()}`}></div>
                      <span className="text-sm font-medium">{getFaceDetectionStatus()}</span>
                    </div>
                    <div className="flex space-x-2">
                      {cameraError && (
                        <button
                          onClick={handleRetryCamera}
                          className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-colors duration-200"
                        >
                          Retry
                        </button>
                      )}
                      {lockedFace && (
                        <button
                          onClick={handleClearLock}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                          Clear Lock
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced detection progress */}
                  {!cameraError && !isInitializing && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            lockedFace ? 'bg-purple-500' :
                            faceDetection.faceDetected && faceDetection.isHuman
                              ? faceDetection.faceQuality === 'excellent' ? 'bg-green-500' :
                                faceDetection.faceQuality === 'good' ? 'bg-blue-500' :
                                faceDetection.faceQuality === 'fair' ? 'bg-yellow-500' : 'bg-orange-500'
                              : 'bg-gray-400'
                          }`}
                          style={{ width: lockedFace ? '100%' : `${faceDetection.confidence * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Quality and human detection feedback */}
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-primary/60">
                          {getQualityMessage()}
                        </p>
                        {(faceDetection.faceDetected || lockedFace) && (
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`flex items-center space-x-1 ${
                              lockedFace || faceDetection.isHuman ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              <span>👤</span>
                              <span>{lockedFace || faceDetection.isHuman ? 'Human' : 'Non-human'}</span>
                            </span>
                            <span className="text-primary/60">
                              Quality: {lockedFace ? lockedFace.quality : faceDetection.faceQuality}
                            </span>
                            {!lockedFace && (
                              <span className="text-primary/60">
                                Faces: {faceDetection.faceCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Real-time Timer Display */}
                  {lockedFace && lockTimeRemaining > 0 && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700">Face Lock Timer</span>
                        </div>
                        <span className={`text-lg font-bold ${getTimerColor()}`}>
                          {lockTimeRemaining}s
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <motion.div 
                          className="h-2 rounded-full transition-all duration-100"
                          style={{ 
                            width: `${getTimerProgress()}%`,
                            backgroundColor: lockTimeRemaining > 20 ? '#10b981' : 
                                           lockTimeRemaining > 10 ? '#f59e0b' : 
                                           lockTimeRemaining > 5 ? '#f97316' : '#ef4444'
                          }}
                          animate={{ 
                            scale: lockTimeRemaining <= 5 ? [1, 1.02, 1] : 1 
                          }}
                          transition={{ 
                            duration: 0.5, 
                            repeat: lockTimeRemaining <= 5 ? Infinity : 0 
                          }}
                        />
                      </div>
                      
                      <p className="text-xs text-purple-600 mt-1">
                        {lockTimeRemaining > 20 ? '✅ Plenty of time remaining' :
                         lockTimeRemaining > 10 ? '⏰ Half time remaining' :
                         lockTimeRemaining > 5 ? '⚠️ Lock expiring soon' :
                         '🚨 Lock about to expire!'}
                      </p>
                    </div>
                  )}
                  
                  {/* Error messages */}
                  {cameraError && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600">{cameraError}</p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-primary/60 mt-4">
                  🔒 Advanced face locking with complete privacy protection
                </p>
              </div>
            </div>
          </motion.div>

          {/* Camera Interface - Right Side */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Camera Container */}
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                <div className={`absolute inset-4 rounded-full overflow-hidden bg-black/20 border-4 transition-all duration-300 ${
                  lockedFace
                    ? 'border-purple-400 shadow-lg shadow-purple-400/30'
                    : faceDetection.faceDetected && faceDetection.isHuman
                    ? faceDetection.faceQuality === 'excellent' 
                      ? 'border-green-400 shadow-lg shadow-green-400/30' 
                      : faceDetection.faceQuality === 'good'
                      ? 'border-blue-400 shadow-lg shadow-blue-400/30'
                      : 'border-yellow-400 shadow-lg shadow-yellow-400/30'
                    : 'border-white/50'
                }`}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {(!cameraStream || cameraError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20">
                      {cameraError ? (
                        <div className="text-center px-4">
                          <p className="text-primary/70 text-sm mb-3">Camera unavailable</p>
                          <button
                            onClick={handleRetryCamera}
                            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-full text-sm transition-colors duration-200"
                          >
                            Retry Camera
                          </button>
                        </div>
                      ) : (
                        <p className="text-primary/70 text-sm">Initializing camera...</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Enhanced Face Detection Indicator */}
                {cameraStream && !cameraError && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`p-2 rounded-full ${getFaceDetectionColor()}/90 backdrop-blur-sm border-2 border-white/50 shadow-lg`}>
                      {getFaceQualityIcon()}
                    </div>
                  </div>
                )}

                {/* Enhanced Real-time Timer Display */}
                {lockedFace && lockTimeRemaining > 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <motion.div 
                      className={`${getTimerBgColor()} backdrop-blur-sm rounded-full px-3 py-1 border-2 border-white/50 shadow-lg`}
                      animate={{ 
                        scale: lockTimeRemaining <= 5 ? [1, 1.05, 1] : 1,
                        boxShadow: lockTimeRemaining <= 5 ? 
                          ['0 4px 6px rgba(0,0,0,0.1)', '0 8px 15px rgba(239,68,68,0.3)', '0 4px 6px rgba(0,0,0,0.1)'] : 
                          '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: lockTimeRemaining <= 5 ? Infinity : 0 
                      }}
                    >
                      <div className="flex items-center space-x-1 text-white text-sm font-bold">
                        <Timer className="w-3 h-3" />
                        <span>{lockTimeRemaining}s</span>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {/* Face Detection Guide Overlay */}
                {cameraStream && !cameraError && !lockedFace && (!faceDetection.faceDetected || !faceDetection.isHuman) && !isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-dashed border-white/50 rounded-full w-48 h-60 flex items-center justify-center">
                      <div className="text-white/70 text-center">
                        <User className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">
                          {!faceDetection.faceDetected 
                            ? 'Position your face here' 
                            : 'Human face required'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Face Locking Overlay */}
                <AnimatePresence>
                  {isLockingFace && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-full p-8 shadow-xl border-4 border-purple-200">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="text-6xl text-center"
                        >
                          🔒
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Mood Detection Overlay */}
                <AnimatePresence>
                  {isDetecting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center z-20"
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-full p-8 shadow-xl border-4 border-primary/20">
                        <motion.div
                          key={currentEmotion}
                          initial={{ rotateY: 0, scale: 1 }}
                          animate={{ rotateY: 360, scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.15 }}
                          className="text-6xl text-center"
                        >
                          {emotionEmojis[currentEmotion as keyof typeof emotionEmojis]}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result Display */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center border-2 border-primary/20"
                    >
                      <p className="font-mood text-2xl text-primary mb-2">
                        Hey {state.user.username}, you're feeling '{currentEmotion}' today{' '}
                        <span className="text-3xl">{emotionEmojis[currentEmotion as keyof typeof emotionEmojis]}</span>
                      </p>
                      <p className="font-body text-primary/70 text-sm">
                        {lockedFace ? 'Used locked face for analysis • ' : ''}Redirecting to your personalized songs...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Face Lock Button */}
              {!isDetecting && !showResult && !lockedFace && canLockFace() && (
                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLockFace}
                  disabled={isLockingFace}
                  className="mt-8 font-heading font-medium px-6 py-3 rounded-full text-base transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto bg-purple-500 hover:bg-purple-600 text-white hover:shadow-xl"
                >
                  {isLockingFace ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Locking Face...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Lock Face</span>
                    </>
                  )}
                </motion.button>
              )}

              {/* Enhanced Detection Button */}
              {!isDetecting && !showResult && (
                <motion.button
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: canDetectMood() ? 1.05 : 1 }}
                  whileTap={{ scale: canDetectMood() ? 0.95 : 1 }}
                  onClick={handleMoodDetection}
                  disabled={!canDetectMood()}
                  className={`${lockedFace ? 'mt-8' : 'mt-12'} font-heading font-medium px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto ${
                    canDetectMood()
                      ? 'bg-primary hover:bg-primary/90 text-white hover:shadow-xl cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {lockedFace ? (
                    <Sparkles className="w-5 h-5" />
                  ) : faceDetection.faceDetected && faceDetection.isHuman ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  <span>{getButtonText()}</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MoodDetectionPage;