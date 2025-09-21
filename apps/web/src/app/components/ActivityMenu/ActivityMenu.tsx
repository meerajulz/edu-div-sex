'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { playAudio } from '../../utils/audioPlayer';
import { ActivityConfig, ActivitySection, getNextUnlockedSection } from './activityConfig';

interface ActivityMenuProps {
  isVisible: boolean;
  config: ActivityConfig;
  onSectionClick?: (section: ActivitySection) => void;
  containerPosition?: {
    top?: string;
    left?: string;
    transform?: string;
  };
}

const ActivityMenu: React.FC<ActivityMenuProps> = ({
  isVisible = false,
  config,
  onSectionClick,
  containerPosition = {
    top: '3/4',
    left: '1/2',
    transform: '-translate-x-1/2 -translate-y-1/2',
  },
}) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasAnimated, setHasAnimated] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [sections, setSections] = useState<ActivitySection[]>(config.sections);
  const labelDropSoundsPlayed = useRef<boolean[]>([false, false, false, false]);
  
  // Get the next section that should be highlighted (newly unlocked)
  const nextSectionToPlay = getNextUnlockedSection(sections);

  // Load section progress from API
  useEffect(() => {
    const loadSectionProgress = async () => {
      try {
        const response = await fetch(`/api/user/activity-progress`);
        if (!response.ok) return;
        
        const data = await response.json();
        const activityProgress = data.activityCompletion?.[config.activityId];
        
        console.log('📊 Activity progress data:', activityProgress);
        
        if (activityProgress && activityProgress.scenes) {
          // Update sections based on scene completion
          const updatedSections = config.sections.map((section, sectionIndex) => {
            // Section 1 is always unlocked
            if (section.id === 1) {
              // Check if all scenes in this section are completed
              const allScenesCompleted = section.scenes.every(scenePath => {
                const sceneSlug = scenePath.split('/').pop(); // Extract scene slug from path
                if (!sceneSlug) return false;
                const sceneProgress = activityProgress.scenes[sceneSlug];
                return sceneProgress && sceneProgress.status === 'completed' && sceneProgress.progress >= 100;
              });
              
              return {
                ...section,
                isUnlocked: true,
                isCompleted: allScenesCompleted,
                brightness: 1
              };
            }
            
            // For other sections, check if previous section is completed
            const previousSection = config.sections[sectionIndex - 1];
            const previousSectionCompleted = previousSection.scenes.every(scenePath => {
              const sceneSlug = scenePath.split('/').pop();
              if (!sceneSlug) return false;
              const sceneProgress = activityProgress.scenes[sceneSlug];
              return sceneProgress && sceneProgress.status === 'completed' && sceneProgress.progress >= 100;
            });
            
            // Check if current section is completed
            const currentSectionCompleted = section.scenes.every(scenePath => {
              const sceneSlug = scenePath.split('/').pop();
              if (!sceneSlug) return false;
              const sceneProgress = activityProgress.scenes[sceneSlug];
              return sceneProgress && sceneProgress.status === 'completed' && sceneProgress.progress >= 100;
            });
            
            return {
              ...section,
              isUnlocked: previousSectionCompleted,
              isCompleted: currentSectionCompleted,
              brightness: previousSectionCompleted ? 1 : 0.5
            };
          });
          
          console.log('🔓 Updated sections with unlock status:', updatedSections);
          setSections(updatedSections);
        }
      } catch (error) {
        console.error('❌ Failed to load section progress:', error);
      }
    };

    if (isVisible) {
      loadSectionProgress();
    }
  }, [isVisible, config]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
      setHasAnimated(false);
      labelDropSoundsPlayed.current = [false, false, false, false];
    }
  }, [isVisible]);

  const handleClick = (section: ActivitySection) => {
    if (!section.isUnlocked) {
      // Play locked sound
      playAudio('/audio/button/locked.mp3').catch(() => {
        console.warn('Could not play locked section sound');
      });
      console.log(`🔒 Section ${section.id} is locked! Complete previous sections first.`);
      return;
    }
    
    // Play section sound
    playAudio(section.soundClick).catch(console.warn);
    
    if (onSectionClick) {
      onSectionClick(section);
    } else {
      // Navigate to first scene of the section
      const firstScene = section.scenes[0];
      if (firstScene) {
        router.push(firstScene);
      }
    }
  };

  const playDropSound = (index: number) => {
    if (labelDropSoundsPlayed.current[index]) return;
    labelDropSoundsPlayed.current[index] = true;
    playAudio('/audio/whoosh.mp3', undefined, 0.7).catch(console.warn);
  };

  useEffect(() => {
    if (!isVisible) {
      setHasAnimated(false);
      labelDropSoundsPlayed.current = [false, false, false, false];
    }
  }, [isVisible]);

  // Show loading while progress is being fetched
  if (!isVisible || !isReady) return null;

  const containerPositionClass = `absolute ${containerPosition.top ? `top-${containerPosition.top}` : ''} ${containerPosition.left ? `left-${containerPosition.left}` : ''} ${containerPosition.transform ? `transform ${containerPosition.transform}` : ''}`;

  return (
    <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={containerPositionClass + " w-full flex justify-center items-center"}>
          <div className="relative flex justify-center items-end" style={{ perspective: '500px', transformStyle: 'preserve-3d' }}>
            
            {sections.map((section, index) => {
              const isNextSection = section.id === nextSectionToPlay?.id;
              
              return (
                <motion.div
                  key={section.id}
                  className={`absolute pointer-events-auto ${section.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  initial={{ 
                    y: -100, 
                    x: section.xPosition, 
                    z: section.zPosition, 
                    scale: section.scale, 
                    rotateX: section.rotateX,
                    rotateY: section.rotateY,
                  }}
                  animate={isNextSection ? {
                    // Pulsing animation for next section
                    y: section.yPosition,
                    x: section.xPosition,
                    z: section.zPosition,
                    scale: [section.scale || 1, (section.scale || 1) * 1.1, section.scale || 1],
                    rotateX: section.rotateX,
                    rotateY: section.rotateY,
                    transition: { 
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      default: {
                        type: 'spring', 
                        damping: 12, 
                        stiffness: 70, 
                        delay: section.delay,
                        onComplete: () => {
                          playDropSound(index);
                          if (index === sections.length - 1) {
                            setHasAnimated(true);
                          }
                        }
                      }
                    }
                  } : { 
                    // Normal animation for other sections
                    y: section.yPosition,
                    x: section.xPosition,
                    z: section.zPosition,
                    scale: section.scale,
                    rotateX: section.rotateX,
                    rotateY: section.rotateY,
                    transition: { 
                      type: 'spring', 
                      damping: 12, 
                      stiffness: 70, 
                      delay: section.delay,
                      onComplete: () => {
                        playDropSound(index);
                        if (index === sections.length - 1) {
                          setHasAnimated(true);
                        }
                      }
                    }
                  }}
                  onClick={() => handleClick(section)}
                  whileHover={section.isUnlocked ? { 
                    scale: (section.scale || 1) * 1.3, 
                    y: (section.yPosition || 0) - 10,
                    transition: { duration: 0.2 }
                  } : {}}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    zIndex: isNextSection ? 100 : (40 - index), // Higher z-index for next section
                    filter: `brightness(${section.brightness || 1})`,
                    // Add a subtle glow effect for the next section
                    ...(isNextSection && section.isUnlocked ? {
                      //boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)'
                    } : {})
                  }}
                >
                  <div className="relative" style={{ width: `${150 * (section.scale || 1)}px`, height: `${200 * (section.scale || 1)}px` }}>
                    <Image
                      src={section.isUnlocked ? section.activeImage : section.inactiveImage}
                      alt={section.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      priority={index === 0}
                    />
                    
                    {/* Lock overlay for inactive sections */}
                    {!section.isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-2xl">🔒</div>
                      </div>
                    )}

                    {/* Completed checkmark */}
                    {section.isCompleted && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="text-white text-sm">✓</div>
                      </div>
                    )}
                  </div>

                  {section.title && (
                    <motion.div 
                      className="absolute bg-white top-28 left-1/2 transform -translate-x-1/2 text-center w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: (section.delay || 0) + 0.3 } }}
                    >
                      <p className={`font-bold ${section.isUnlocked ? 'text-orange-800' : 'text-gray-600'}`}
                        style={{ fontSize: `${12 * (section.scale || 1)}px` }}>
                        {section.title}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityMenu;