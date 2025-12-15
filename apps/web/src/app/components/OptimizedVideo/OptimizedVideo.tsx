'use client';

import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { logVideoError, logPerformanceWarning } from '../../utils/errorLogger';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  playsInline?: boolean;
  onEnded?: () => void;
  onLoadedData?: () => void;
  onPlay?: () => void;
  volume?: number;
  muted?: boolean;
  // Performance options
  lazyLoad?: boolean;
  lowPowerMode?: boolean; // For older devices
  maxRetries?: number;
}

const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(({
  src,
  poster,
  className = '',
  autoPlay = false,
  playsInline = true,
  onEnded,
  onLoadedData,
  onPlay,
  volume = 0.8,
  muted = false,
  lazyLoad = true,
  lowPowerMode = false,
  maxRetries = 3,
}, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null);
  const videoRef = internalRef;
  const containerRef = useRef<HTMLDivElement>(null); // Container for Intersection Observer
  const loadStartTime = useRef<number>(0);

  // State declarations MUST come before useEffect
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad);

  // Debug logging
  useEffect(() => {
    console.log(`📹 OptimizedVideo: Component mounted - lazyLoad: ${lazyLoad}, shouldLoad: ${shouldLoad}, src: ${src}`);
  }, []);

  // Sync forwarded ref with internal ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else {
        (ref as React.MutableRefObject<HTMLVideoElement | null>).current = internalRef.current;
      }
    }

    // Cleanup
    return () => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(null);
        } else {
          (ref as React.MutableRefObject<HTMLVideoElement | null>).current = null;
        }
      }
    };
  }, [ref, shouldLoad]); // Re-sync when video element is created

  // Detect if device is low-powered (old Android tablets)
  const isLowPowerDevice = () => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory;

    // If device reports low memory (< 4GB) or is Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    const hasLowMemory = memory !== undefined && memory < 4;

    return lowPowerMode || hasLowMemory || isAndroid;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || shouldLoad) return;

    const container = containerRef.current;
    if (!container) return;

    // Check if already in viewport on mount
    const rect = container.getBoundingClientRect();
    const isInViewport = (
      rect.top < window.innerHeight + 200 &&
      rect.bottom > -200 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );

    if (isInViewport) {
      console.log('📹 OptimizedVideo: Already in viewport, loading immediately');
      setShouldLoad(true);
      return;
    }

    // Otherwise set up observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('📹 OptimizedVideo: Container entering viewport, starting video load');
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before visible
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [lazyLoad, shouldLoad]);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const handleLoadStart = () => {
      loadStartTime.current = Date.now();
      setIsLoading(true);
      console.log('📹 OptimizedVideo: Load started for:', src);
    };

    const handleLoadedMetadata = () => {
      const loadTime = Date.now() - loadStartTime.current;
      console.log(`📹 OptimizedVideo: Metadata loaded in ${loadTime}ms`);

      // Warn if metadata takes too long (>3s)
      logPerformanceWarning('video metadata load', loadTime, 3000, {
        src,
        device: navigator.userAgent,
      });
    };

    const handleLoadedData = () => {
      const loadTime = Date.now() - loadStartTime.current;
      console.log(`📹 OptimizedVideo: Data loaded in ${loadTime}ms`);
      setIsLoading(false);
      setLoadError(null);

      // Warn if data load takes too long (>5s)
      logPerformanceWarning('video data load', loadTime, 5000, {
        src,
        device: navigator.userAgent,
      });

      if (onLoadedData) onLoadedData();
    };

    const handleError = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      const error = video.error;

      console.error('📹 OptimizedVideo: Error loading video:', error);

      if (error) {
        logVideoError(src, error, {
          retryCount,
          readyState: video.readyState,
          networkState: video.networkState,
        });

        // Retry logic
        if (retryCount < maxRetries) {
          console.log(`📹 OptimizedVideo: Retrying (${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            video.load();
          }, 2000 * (retryCount + 1)); // Exponential backoff
        } else {
          setLoadError('No se pudo cargar el video. Por favor, actualiza la página.');
          setIsLoading(false);
        }
      }
    };

    const handleCanPlayThrough = () => {
      console.log('📹 OptimizedVideo: Can play through without buffering');
    };

    const handleWaiting = () => {
      console.log('📹 OptimizedVideo: Buffering...');
    };

    const handleStalled = () => {
      console.warn('📹 OptimizedVideo: Network stalled');
      logVideoError(src, 'Network stalled during video playback', {
        readyState: video.readyState,
        networkState: video.networkState,
      });
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleStalled);

    if (onEnded) video.addEventListener('ended', onEnded);
    if (onPlay) video.addEventListener('play', onPlay);

    // Start loading
    video.load();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleStalled);
      if (onEnded) video.removeEventListener('ended', onEnded);
      if (onPlay) video.removeEventListener('play', onPlay);
    };
  }, [src, shouldLoad, retryCount, maxRetries, onEnded, onLoadedData, onPlay]);

  // Apply volume when video is ready
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) {
      video.volume = volume;
      video.muted = muted;
    }
  }, [volume, muted]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {shouldLoad ? (
        <>
          <video
            ref={videoRef}
            className={className}
            playsInline={playsInline}
            autoPlay={autoPlay}
            poster={poster}
            // Use "metadata" for low-power devices, "auto" for others
            preload={isLowPowerDevice() ? 'metadata' : 'metadata'}
            muted={muted}
          >
            <source src={src} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>

          {/* Loading overlay */}
          {isLoading && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="text-white text-sm">Cargando video...</p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-600 font-semibold mb-4">{loadError}</p>
                <button
                  onClick={() => {
                    setLoadError(null);
                    setRetryCount(0);
                    setShouldLoad(true);
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Placeholder before lazy load
        <div
          className={`${className} flex items-center justify-center bg-gray-200`}
          style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover' } : {}}
        >
          {!poster && (
            <div className="text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;
