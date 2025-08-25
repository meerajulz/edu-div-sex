'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { playAudio } from '../../utils/audioPlayer';
//import ArrowButton3D from './ArrowButton3D';

interface ActivityLabel {
  id: number;
  isActive: boolean;
  title: string;
  activeImage: string;
  inactiveImage: string;
  url: string;
  soundUrl: string;
  xPosition?: number;
  yPosition?: number;
  zPosition?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  delay?: number;
  brightness?: number;
  soundClick: string;
}

interface ActivityLabelsProps {
  isVisible: boolean;
  onLabelClick?: (id: number, url: string) => void;
  containerPosition?: {
    top?: string;
    left?: string;
    transform?: string;
  };
  customActivities?: ActivityLabel[];
}

const ActivityLabels: React.FC<ActivityLabelsProps> = ({
  isVisible = false,
  onLabelClick,
  containerPosition = {
    top: '3/4',
    left: '1/2',
    transform: '-translate-x-1/2 -translate-y-1/2',
  },
  customActivities,
}) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasAnimated, setHasAnimated] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const labelDropSoundsPlayed = useRef<boolean[]>([false, false, false, false]);

  const defaultActivities: ActivityLabel[] = [
    {
      id: 1,
      isActive: true,
      title: "Descubriendo Mi Cuerpo",
      activeImage: "/svg/menu-actividad/cartell-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-hover.svg",
      url: "/actividad-1/scene1/",
      soundUrl: "/audio/whoosh.mp3",
      soundClick: "/audio/labels/actividad1.mp3",
      xPosition: -60,
      yPosition: 280,
      zPosition: 150,
      scale: 0.9,
      rotateX: 18,
      rotateY: -15,
      delay: 0.2,
      brightness: 1
    },
    {
      id: 2,
      isActive: true,
      title: "Intimidad",
      activeImage: "/svg/menu-actividad/cartell-2-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-2-hover.svg",
      url: "/actividad-2/scene1",
      soundUrl: "/audio/whoosh.mp3",
      soundClick: "/audio/labels/actividad2.mp3",
      xPosition: 100,
      yPosition: 350,
      zPosition: -50,
      scale: 0.9,
      rotateX: 18,
      rotateY: -25,
      delay: 0.5,
      brightness: 1
    },
    {
      id: 3,
      isActive: true,
      title: "Placer sexual",
      activeImage: "/svg/menu-actividad/cartell-3-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-3-hover.svg",
      url: "/actividad-3/scene1",
      soundUrl: "/audio/whoosh.mp3",
      soundClick: "/audio/labels/actividad3.mp3",
      xPosition: -150,
      yPosition: 280,
      zPosition: -300,
      scale: 0.9,
      rotateX: -0,
      rotateY: 20,
      delay: 0.9,
      brightness: 1
    },
    {
      id: 4,
      isActive: true,
      title: "Cuido de mi sexualidad",
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      url: "/actividad-4/scene1",
      soundUrl: "/audio/whoosh.mp3",
      soundClick: "/audio/labels/actividad4.mp3",
      xPosition: 40,
      yPosition: 350,
      zPosition: -500,
      scale: 1,
      rotateX: 15,
      rotateY: -10,
      delay: 1.1,
      brightness: 1
    },
    {
      id: 5,
      isActive: true,
      title: "Nos entendemos y respetamos",
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      url: "/actividad-5/scene1",
      soundUrl: "/audio/whoosh.mp3",
      soundClick: "/audio/labels/actividad5.mp3",
      xPosition: -150,
      yPosition: 190,
      zPosition: -700,
      scale: 1,
      rotateX: 10,
      rotateY: 10,
      delay: 1.5,
      brightness: 1
    },
    {
      id: 6,
      isActive: true,
      title: "Abuso",
      activeImage: "/svg/menu-actividad/cartell-4-active.svg",
      inactiveImage: "/svg/menu-actividad/cartell-4-hover.svg",
      url: "/actividad-6/scene1",
      soundUrl: "/audio/whoosh.mp3",
      soundClick: "/audio/labels/actividad6.mp3",
      xPosition: 50,
      yPosition: 180,
      zPosition: -690,
      scale: 1,
      rotateX: 0,
      rotateY: -20,
      delay: 1.8,
      brightness: 1
    }
  ];

  const activities = customActivities || defaultActivities;

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

const handleClick = (activity: ActivityLabel) => {
  if (!activity.isActive) return;
  //playAudio('/audio/labels/descubiriendo-mi-cuerpo.mp3', undefined, 0.7).catch(console.warn); // ✅ Uses each activity's specific sound
  playAudio(activity.soundClick).catch(console.warn); // ✅ Uses each activity's specific sound
  if (onLabelClick) {
    onLabelClick(activity.id, activity.url);
  } else {
    router.push(activity.url);
  }
};

  const playDropSound = (index: number) => {
    if (labelDropSoundsPlayed.current[index]) return;
    labelDropSoundsPlayed.current[index] = true;
    playAudio(activities[index].soundUrl, undefined, 0.7).catch(console.warn);
  };

  useEffect(() => {
    if (!isVisible) {
      setHasAnimated(false);
      labelDropSoundsPlayed.current = [false, false, false, false];
    }
  }, [isVisible]);

  if (!isVisible || !isReady) return null;

  // const lastActive = activities
  //   .filter(activity => activity.isActive)
  //   .sort((a, b) => b.id - a.id)[0];

  const containerPositionClass = `absolute ${containerPosition.top ? `top-${containerPosition.top}` : ''} ${containerPosition.left ? `left-${containerPosition.left}` : ''} ${containerPosition.transform ? `transform ${containerPosition.transform}` : ''}`;

  return (
    <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={containerPositionClass + " w-full flex justify-center items-center"}>
          <div className="relative flex justify-center items-end" style={{ perspective: '500px', transformStyle: 'preserve-3d' }}>
            
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className={`absolute pointer-events-auto ${activity.isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                initial={{ 
                  y: -100, 
                  x: activity.xPosition, 
                  z: activity.zPosition, 
                  scale: activity.scale, 
                  rotateX: activity.rotateX,
                  rotateY: activity.rotateY,
                }}
                animate={{ 
                  y: activity.yPosition,
                  x: activity.xPosition,
                  z: activity.zPosition,
                  scale: activity.scale,
                  rotateX: activity.rotateX,
                  rotateY: activity.rotateY,
                  transition: { 
                    type: 'spring', 
                    damping: 12, 
                    stiffness: 70, 
                    delay: activity.delay,
                    onComplete: () => {
                      playDropSound(index);
                      if (index === activities.length - 1) {
                        setHasAnimated(true);
                      }
                    }
                  }
                }}
                onClick={() => handleClick(activity)}
                whileHover={activity.isActive ? { 
                  scale: (activity.scale || 1) * 1.3, 
                  y: (activity.yPosition || 0) - 10,
                  transition: { duration: 0.2 }
                } : {}}
                style={{ 
                  transformStyle: 'preserve-3d',
                  zIndex: 40 - index,
                  filter: `brightness(${activity.brightness || 1})`
                }}
              >
                <div className="relative" style={{ width: `${150 * (activity.scale || 1)}px`, height: `${200 * (activity.scale || 1)}px` }}>
                  <Image
                    src={activity.isActive ? activity.activeImage : activity.inactiveImage}
                    alt={activity.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={index === 0}
                  />
                </div>

                {activity.title && (
                  <motion.div 
                    className="absolute bg-white top-28 left-1/2 transform -translate-x-1/2 text-center w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: (activity.delay || 0) + 0.3 } }}
                  >
                    <p className={`text-base font-bold ${activity.isActive ? 'text-orange-800' : 'text-gray-600'}`}
                      style={{ fontSize: `${12 * (activity.scale || 1)}px` }}>
                      {activity.title}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLabels;
