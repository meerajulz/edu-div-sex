VolverAVerButton Implementation Guide

  Here's a comprehensive guide on how we
  implemented the "Volver a ver" (Watch
  again) button functionality across the
  scenes:

  1. Created the Reusable Component

  First, we created a reusable component at
   /src/app/components/VolverAVerButton/Vol
  verAVerButton.tsx:

  'use client';

  import React from 'react';
  import { motion } from 'framer-motion';

  interface VolverAVerButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
  }

  const VolverAVerButton:
  React.FC<VolverAVerButtonProps> = ({
    onClick,
    disabled = false,
    className = ""
  }) => {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`bg-orange-500/90 
  hover:bg-orange-500 backdrop-blur-sm 
  text-white font-bold py-3 px-6 
  rounded-full border-2 border-orange-400 
  hover:border-orange-300 transition-all 
  duration-300 shadow-2xl flex items-center
   gap-2 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay:
   0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-4 h-4" 
  fill="none" stroke="currentColor" 
  viewBox="0 0 24 24">
          <path strokeLinecap="round" 
  strokeLinejoin="round" strokeWidth={2} 
  d="M4 4v5h.582m15.356 2A8.001 8.001 0 
  004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 
  8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Volver a ver
      </motion.button>
    );
  };

  export default VolverAVerButton;

  Key features:
  - Orange styling with hover effects
  - Refresh icon (circular arrow)
  - Framer Motion animations
  - Consistent design across all scenes

  2. Implementation Pattern for Each Scene

  For each scene that needs the
  VolverAVerButton, follow this pattern:

  Step 1: Add Import

  import VolverAVerButton from '../../compo
  nents/VolverAVerButton/VolverAVerButton';

  Step 2: Add State Management

  // For replaying previous scene
  const [showPreviousSceneVideo,
  setShowPreviousSceneVideo] =
  useState(false);
  // For replaying current scene  
  const [showCurrentSceneReplay,
  setShowCurrentSceneReplay] =
  useState(false);

  Step 3: Add Handler Functions

  // Previous scene replay
  const handleVolverAVerPreviousScene = () 
  => {
    setShowPreviousSceneVideo(true);
  };

  const handlePreviousSceneVideoEnd = () =>
   {
    setShowPreviousSceneVideo(false);
  };

  // Current scene replay  
  const handleVolverAVerCurrentScene = () 
  => {
    setShowCurrentSceneReplay(true);
  };

  const handleCurrentSceneReplayEnd = () =>
   {
    setShowCurrentSceneReplay(false);
  };

  Step 4: Update Conditional Rendering

  {!showVideo && !showPreviousSceneVideo &&
   !showCurrentSceneReplay ? (
    // Initial screen with buttons
  ) : showPreviousSceneVideo ? (
    // Previous scene video replay
    <div className="absolute" 
  style={containerStyle}>
      <video
        className="absolute inset-0 w-full 
  h-full object-cover z-20"
        
  src="/video/PREVIOUS-SCENE-VIDEO.mp4"
        autoPlay
        playsInline
        
  onEnded={handlePreviousSceneVideoEnd}
      />
    </div>
  ) : showCurrentSceneReplay ? (
    // Current scene video replay
    <div className="absolute" 
  style={containerStyle}>
      <video
        className="absolute inset-0 w-full 
  h-full object-cover z-20"
        
  src="/video/CURRENT-SCENE-VIDEO.mp4"
        autoPlay
        playsInline
        
  onEnded={handleCurrentSceneReplayEnd}
      />
    </div>
  ) : (
    // Normal scene flow
  )}

  Step 5: Add Buttons in UI

  For initial screen (replay previous 
  scene):
  <div className="relative z-20 flex 
  flex-col items-center justify-center 
  min-h-screen gap-6">
    <motion.div animate={isAnimating ? { 
  scale: [1, 1.3, 1], rotate: [0, -360] } :
   {}}>
      <JugarButton text='Jugar' 
  onClick={handleJugarClick} 
  disabled={isAnimating} />
    </motion.div>

    {/* Button to replay previous scene */}
    <VolverAVerButton
  onClick={handleVolverAVerPreviousScene}
  />
  </div>

  For after scene video (replay current 
  scene):
  <div className="flex flex-col 
  items-center gap-6">
    <motion.div animate={isAnimating ? { 
  scale: [1, 1.3, 1], rotate: [0, -360] } :
   {}}>
      <JugarButton text="Game Button Text" 
  onClick={handleOpenGame} 
  disabled={isAnimating} />
    </motion.div>

    {/* Button to replay current scene 
  video when game is available */}
    {!gameCompleted && (
      <VolverAVerButton 
  onClick={handleVolverAVerCurrentScene} />
    )}
  </div>

  3. Specific Implementation Examples

  Scene 1 (Special case - video replay 
  within same scene)

  - Only replays Scene 1's own video
  - Button appears after watching video
  once (localStorage persistence)
  - Positioned between ButtonGlobe and Cris
   components

  Scene 3 (Standard pattern)

  - Button to replay Scene 2 under main
  Jugar button
  - Standard video replay functionality

  Scene 4 (Complex case - multiple buttons)

  - Button to replay Scene 3 under main
  Jugar button
  - Button to replay Scene 4 under game
  button
  - Multiple replay states managed

  Scene 6 (Dual functionality)

  - Button to replay Scene 5 under main
  Jugar button
  - Button to replay Scene 6 under "¿Qué es
   una erección?" button

  Scene 7 (Final scene)

  - Button to replay Scene 7 under "IR A LA
   PROXIMA AVENTURA!" button
  - Only current scene replay (no previous
  scene button)

  4. Video File Naming Convention

  - Scene 1: /video/ACTIVIDA_1-ESCENA-1.mp4
  - Scene 2:
  /video/ACTIVIDAD_1_ESCENA_2.mp4
  - Scene 3: /video/ACTIVIDAD-1-ESCENA3.mp4
  - Scene 4:
  /video/ACTIVIDAD-1-ESCENA-4.mp4
  - Scene 5:
  /video/ACTIVIDAD-1-ESCENA-5.mp4
  - Scene 6:
  /video/ACTIVIDAD-1-ESCENA-6.mp4
  - Scene 7:
  /video/ACTIVIDAD-1-ESCENA-7.mp4

  5. Key Design Principles

  1. Consistent Positioning: Always under
  the main action button
  2. Orange Styling: Matches the design
  system
  3. Framer Motion: Smooth animations for
  better UX
  4. State Management: Clear separation of
  replay states
  5. Video Handling: Proper autoplay and
  end event handling
  6. Responsive Design: Works across
  different screen sizes

  6. Common Patterns

  - Initial Screen: Previous scene replay
  button under main Jugar button
  - After Video: Current scene replay
  button under game/action button
  - Conditional Display: Only show when
  relevant (e.g., not after game
  completion)
  - Consistent Spacing: Use gap-6 for
  proper button spacing
  - Z-index Management: Ensure proper
  layering with other elements

  This pattern can be easily replicated for
   any new scenes or activities by
  following the same structure and adapting
   the video sources and state names
  accordingly.

  
  