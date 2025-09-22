'use client';

import { motion } from 'framer-motion';
import FloatingMenu from './../../components/FloatingMenu/FloatingMenu';
import JugarButton from '../../components/JugarButton/JugarButton';
import VolverAVerButton from '../../components/VolverAVerButton/VolverAVerButton';
import JuegoTresActividad3 from './JuegoTresActividad3/JuegoTresActividad3'; // FIXED: Correct import name
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LogoComponent from '@/app/components/LogoComponent/LogoComponent';
import { useActivityProtection } from '../../components/ActivityGuard/useActivityProtection';
import { useProgressSaver } from '../../hooks/useProgressSaver';
import { useActivityTracking } from '../../hooks/useActivityTracking';

// Helper function to get user gender from session
const getUserGender = (session: { user?: { sex?: string } } | null): 'male' | 'female' => {
  const sessionSex = session?.user?.sex?.toLowerCase();
  
  // Handle various possible values from the session
  if (sessionSex === 'male' || sessionSex === 'm' || sessionSex === 'masculino') {
    return 'male';
  } else if (sessionSex === 'female' || sessionSex === 'f' || sessionSex === 'femenino') {
    return 'female';
  }
  
  // Default fallback
  console.warn('⚠️ No valid gender found in session, defaulting to female');
  return 'female';
};

export default function Actividad3Scene2Page() {
  
  // Track current activity URL for continue feature
  useActivityTracking();
const { data: session } = useSession();
  const router = useRouter();
  const { saveProgress } = useProgressSaver();
  
  useActivityProtection();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showJuegoCuatro, setShowJuegoCuatro] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  
  // Get user gender from session
  const userGender = getUserGender(session);
  
  // Debug logging
  console.log('🎯 User gender from session:', session?.user?.sex);
  console.log('🎯 Parsed user gender:', userGender);
  console.log('🎯 Full session user data:', session?.user);
  
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [browserDimensions, setBrowserDimensions] = useState({ width: 0, height: 0 });
  const aspectRatio = 16 / 9;

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setBrowserDimensions({ width: vw, height: vh });

      let width = vw;
      let height = width / aspectRatio;

      if (height < vh) {
        height = vh;
        width = height * aspectRatio;
      }

      setContainerDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const containerStyle = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    left: `${(browserDimensions.width - containerDimensions.width) / 2}px`,
    top: `${(browserDimensions.height - containerDimensions.height) / 2}px`,
  };

  const playSound = () => {
    try {
      const audio = new Audio('/audio/button/Bright.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };

  const handleJugarClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();

    setTimeout(() => {
      setIsAnimating(false);

      // Show video first for all users
      console.log('🎬 Showing video first for all users');
      setShowVideo(true);
    }, 800);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setHasWatchedVideo(true);
  };

  const handleReplayVideo = () => {
    setVideoEnded(false);
    setShowVideo(true);
    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleOpenJuegoCuatro = () => {
    playSound();
    setShowJuegoCuatro(true);
  };

  const handleCloseJuegoCuatro = () => {
    setShowJuegoCuatro(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setShowJuegoCuatro(false); // Close the game modal
    // Go directly to final congratulations screen
  };

  const handleGoToNextActivity = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    playSound();
    
    console.log('🎉 Actividad3-Scene2: Final scene completed, saving progress for completed activity');
    
    // Save progress for scene2 and mark entire actividad-3 as completed
    const progressSaved = await saveProgress('actividad-3', 'scene2', 'completed', 100, {
      video_watched: videoEnded,
      game_completed: gameCompleted,
      user_gender: userGender,
      activity_completed: true,
      completed_at: new Date().toISOString()
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      if (progressSaved) {
        console.log('✅ Actividad3-Scene2: Activity 3 completed successfully!');
      } else {
        console.error('❌ Actividad3-Scene2: Failed to save progress, but continuing');
      }
      // Set flag that activity was just completed for auto-rotation
      localStorage.setItem('completedActivityId', '3');
      // Navigate to home page after completing final activity
      router.push('/home');
    }, 800);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Colorful Background gradient - Different colors for Scene 2 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-400 to-green-400 z-0" />

      {/* Floating particles animation */}
      <div className="absolute inset-0 z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Additional colorful elements */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`diamond-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            <div className="w-4 h-4 bg-white/30 transform rotate-45" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 right-0 z-50 flex">
        <FloatingMenu />
      </div>

          <div className="">
            <LogoComponent configKey="actividad-3-scene1" />
          </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 text-xs text-white bg-black/50 p-2 rounded">
          <div>Gender: {userGender}</div>
          <div>Show Video: {showVideo.toString()}</div>
          <div>Video Ended: {videoEnded.toString()}</div>
          <div>Show Game: {showJuegoCuatro.toString()}</div>
          <div>Game Completed: {gameCompleted.toString()}</div>
        </div>
      )}

      {/* Initial Screen: Show Jugar button if no video and no game */}
      {!showVideo && !showJuegoCuatro && !gameCompleted && (
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <JugarButton onClick={handleJugarClick} disabled={isAnimating} />
          </motion.div>
        </div>
      )}

      {/* Video Section (For All Users) - FIXED: Hide when game is completed */}
      {showVideo && !gameCompleted && (
        <div className="absolute" style={containerStyle}>
          {!videoEnded ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-20"
              src="/video/ACTIVIDAD-3-ESCENA-2.mp4"
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              {!showJuegoCuatro && (
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, -360] } : {}}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    <JugarButton
                      onClick={handleOpenJuegoCuatro}
                      disabled={isAnimating}
                      text="Jugar La masturbación"
                    />
                  </motion.div>

                  {/* Volver a ver Button - positioned under main button */}
                  {hasWatchedVideo && (
                    <VolverAVerButton onClick={handleReplayVideo} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Game Completed Screen */}
      {gameCompleted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl mb-8"
            initial={{ rotate: -5 }}
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              ¡Felicidades!
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-semibold">
              ¡Acabaste la aventura Placer Sexual!
            </p>
          </motion.div>
          <motion.div
            className="inline-block"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'center center' }}
          >
            <div className="whitespace-nowrap">
              <JugarButton text="IR A LA PROXIMA AVENTURA!" onClick={handleGoToNextActivity} disabled={isAnimating} />
            </div>
          </motion.div>
        </div>
      

      )}

      {/* FIXED: Correct component name - JuegoTresActividad3 */}
      <JuegoTresActividad3
        isVisible={showJuegoCuatro}
        onClose={handleCloseJuegoCuatro}
        onGameComplete={handleGameComplete}
      />

    </motion.div>
  );
}