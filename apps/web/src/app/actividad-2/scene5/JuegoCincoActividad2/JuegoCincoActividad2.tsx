'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useJuegoCincoGame } from './hooks';
// Update import to use the central CongratsOverlay component
import CongratsOverlay from '@/app/components/CongratsOverlay/CongratsOverlay';
import EscucharInstruccionesButton from '@/app/components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface JuegoCincoActividad2Props {
  isOpen: boolean;
  onClose: () => void;
  onGameComplete?: () => void;
}

export default function JuegoCincoActividad2({ isOpen, onClose, onGameComplete }: JuegoCincoActividad2Props) {
  const {
    gameState,
    // sessionData, // Removed unused variable
    startGame,
    handleItemClick,
    handleItemDrop,
    getItemById,
    getItemStateById,
    canDragItem,
    resetGame,
    playAudio,
    config
  } = useJuegoCincoGame();

  // State for congratulations overlay
  const [showCongrats, setShowCongrats] = useState(false);
  const hasStartedRef = useRef(false);

  // Auto-start game when modal opens
  useEffect(() => {
    if (isOpen && gameState.phase === 'intro' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      // Add a small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        startGame();
      }, 100);
      return () => clearTimeout(timer);
    }

    // Reset hasStarted ref when modal closes
    if (!isOpen) {
      hasStartedRef.current = false;
      setShowCongrats(false);
    }
  }, [isOpen, gameState.phase, startGame]);
  
  // Watch for game completion - Wait for feedback to complete before showing congrats
  useEffect(() => {
    if (gameState.gameCompleted && gameState.lastFeedbackComplete && !showCongrats) {
      // Add a delay to allow the chest closing animation to play
      const timer = setTimeout(() => {
        setShowCongrats(true);
      }, 1500); // Increased delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [gameState.gameCompleted, gameState.lastFeedbackComplete, showCongrats]);

  if (!isOpen) return null;

  // Calculate game stats for congratulations message
  const privateItemsCount = config.items.filter(item => item.isPrivate).length;
  const correctItemsCount = gameState.itemStates.filter(state => state.isInChest && getItemById(state.id)?.isPrivate).length;

  const handleClose = () => {
    resetGame();
    onClose();
  };

  const handleCongratsComplete = () => {
    // Call onGameComplete if provided
    if (onGameComplete) {
      onGameComplete();
    }
    handleClose();
  };

  const handleListenInstructions = async () => {
    // Play the title audio
    await playAudio(config.globalAudio.title);
  };

  // FIXED: Better drop zone detection using chest element ID with proper types
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, itemId: string) => {
    const { point } = info;
    
    console.log('Drag ended for item:', itemId, 'at point:', point);
    
    // Get the chest element by a more reliable method
    const chestElement = document.querySelector('[data-chest="true"]') as HTMLElement;
    if (!chestElement) {
      console.log('Chest element not found');
      return;
    }
    
    const chestRect = chestElement.getBoundingClientRect();
    const chestCenterX = chestRect.left + chestRect.width / 2;
    const chestCenterY = chestRect.top + chestRect.height / 2;
    
    // Calculate distance from drop point to chest center
    const distance = Math.sqrt(
      Math.pow(point.x - chestCenterX, 2) + Math.pow(point.y - chestCenterY, 2)
    );
    
    console.log('Distance to chest center:', distance, 'Chest bounds:', chestRect);
    
    // More generous drop zone (250px radius)
    if (distance < 250) {
      console.log('Item dropped in chest:', itemId);
      handleItemDrop(itemId);
    } else {
      console.log('Item dropped outside chest, distance:', distance);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <motion.div
        className={`relative w-full max-w-[1000px] max-h-[800px] h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
          gameState.backgroundError ? config.backgrounds.error : config.backgrounds.normal
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Decorations - Always visible */}
        <img
          src={config.globalImages.decorationStar}
          alt="Decoration"
          className="absolute bottom-4 right-4 w-28 h-28 "
        />
        <img
          src={config.globalImages.decorationStarLeft}
          alt="Decoration"
          className="absolute top-4 left-4  w-28 h-28 "
        />

        {/* Listen Instructions Button */}
        <EscucharInstruccionesButton
          onPlayInstructions={handleListenInstructions}
          position="top-right"
        />

        {/* Progress Badge - Top left */}
        {gameState.phase !== 'intro' && gameState.phase !== 'completed' && (
          <div className="absolute top-4 left-4 z-10">
            <div className="px-3 py-2 bg-orange-500 text-white rounded-full shadow-lg text-center font-bold text-sm">
              Objetos guardados: {gameState.itemStates.filter(s => s.isInChest).length}/{privateItemsCount}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
        >
          Salir juego
        </button>

        {/* Game Content */}
        <div className="relative w-full h-full p-6 pt-16">
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 left-2 text-xs bg-black text-white p-2 z-50 rounded">
              Phase: {gameState.phase} | Chest: {gameState.cofreOpen.toString()} | Items: {gameState.itemsVisible.toString()}
              <br />
              In Chest: {gameState.itemStates.filter(s => s.isInChest).map(s => s.id).join(', ')}
            </div>
          )}

          {/* Intro Phase - Show title and closed chest */}
          {gameState.phase === 'intro' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {config.title}
                </h2>
                <div className="text-lg text-gray-600 mb-8">
                  Escuchando las instrucciones...
                </div>
                {/* Closed chest during intro */}
                <img
                  src={config.globalImages.cofreClosed}
                  alt="Cofre cerrado"
                  className="mx-auto max-h-[400px] object-contain"
                />
              </div>
            </div>
          )}

          {/* Playing Phase - Show open chest and items */}
          {gameState.phase !== 'intro' && (
            <div className="relative w-full h-full">
              {/* Open/Closed Chest - FIXED: Shows closed chest when game is completed */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AnimatePresence mode="wait">
                  {gameState.gameCompleted ? (
                    // Closed chest when game is completed
                    <motion.img
                      key="chest-closed"
                      src={config.globalImages.cofreClosed}
                      alt="Cofre cerrado"
                      data-chest="true"
                      className="max-h-[400px] object-contain"
                      initial={{ scale: 1.1, rotateY: 0 }}
                      animate={{
                        scale: [1.1, 0.95, 1],
                        rotateY: [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                        times: [0, 0.5, 1]
                      }}
                    />
                  ) : (
                    // Open chest during gameplay - FIXED: Animation types
                    <motion.img
                      key="chest-open"
                      src={config.globalImages.cofreOpen}
                      alt="Cofre abierto"
                      data-chest="true"
                      className="max-h-[400px] object-contain"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      exit={{
                        scale: 0.9,
                        rotateY: 10,
                        transition: { duration: 0.4 }
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Items in chest - FIXED: Only show when chest is open AND game not completed */}
                {!gameState.gameCompleted && gameState.phase !== 'completed' && (
                  <AnimatePresence>
                    <motion.div 
                      key="chest-items-container"
                      className="absolute inset-0 flex flex-wrap justify-center items-center p-4"
                      exit={{ 
                        opacity: 0,
                        scale: 0.5,
                        transition: { duration: 0.5, ease: 'easeInOut' }
                      }}
                    >
                      {gameState.itemStates
                        .filter(state => state.isInChest)
                        .map((state, index) => {
                          const item = getItemById(state.id);
                          if (!item) return null;
                          
                          // Debug log to see which items are being rendered
                          console.log(`Rendering item in chest: ${item.id}, isPrivate: ${item.isPrivate}, gameCompleted: ${gameState.gameCompleted}`);
                          
                          return (
                            <motion.img
                              key={`chest-${state.id}`}
                              src={item.image}
                              alt={`${item.name} in chest`}
                              className="w-24 h-24 object-contain m-1"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{
                                scale: 0,
                                opacity: 0,
                                transition: {
                                  duration: 0.4,
                                  ease: 'easeInOut',
                                  delay: index * 0.1
                                }
                              }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.3,
                                ease: 'easeOut'
                              }}
                            />
                          );
                        })}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* FIXED: Draggable Items - Hide ALL items when game is completed */}
              <AnimatePresence mode="popLayout">
                {gameState.itemsVisible && !gameState.gameCompleted && config.items.map((item, index) => {
                  const itemState = getItemStateById(item.id);
                  
                  // CRITICAL FIX: Don't render if item is in chest OR game is completed
                  if (!itemState || itemState.isInChest || gameState.gameCompleted) {
                    console.log(`Item ${item.id} not rendered - inChest: ${itemState?.isInChest}, gameCompleted: ${gameState.gameCompleted}`);
                    return null;
                  }

                  const isDraggable = canDragItem(item.id);

                  // Calculate move away position based on item's original position
                  const hasLeft = 'left' in item.position;
                  const hasTop = 'top' in item.position;
                  const moveAwayAnimation = itemState.shouldMoveAway ? {
                    x: hasLeft && parseFloat(item.position.left as string) < 50 ? -400 : 400,
                    y: hasTop && parseFloat(item.position.top as string) < 50 ? -200 : 200,
                    opacity: 0,
                    scale: 0.5
                  } : {};

                  return (
                    <motion.div
                      key={`draggable-${item.id}`} // Unique key for draggable items
                      className={`absolute ${isDraggable ? 'cursor-grab' : 'cursor-not-allowed'}`}
                      style={{
                        ...item.position,
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        touchAction: 'none'
                      }}
                      initial={config.animations.itemAppear.initial}
                      animate={itemState.shouldMoveAway ? moveAwayAnimation : config.animations.itemAppear.animate}
                      exit={{
                        opacity: 0,
                        scale: 0,
                        transition: { duration: 0.2 }
                      }}
                      transition={{
                        ...config.animations.itemAppear.transition,
                        delay: itemState.shouldMoveAway ? 0 : index * 0.2,
                        duration: itemState.shouldMoveAway ? 0.6 : config.animations.itemAppear.transition.duration
                      }}
                      drag={isDraggable}
                      dragMomentum={false}
                      dragConstraints={{
                        left: -window.innerWidth/4,
                        right: window.innerWidth/4,
                        top: -window.innerHeight/4,
                        bottom: window.innerHeight/4
                      }}
                      onDragStart={() => {
                        console.log('Started dragging:', item.id);
                      }}
                      onDragEnd={(event, info) => {
                        console.log('Ended dragging:', item.id);
                        handleDragEnd(event, info, item.id);
                      }}
                      onPointerDown={(e) => {
                        // Prevent default to stop context menu/share sheet on long press
                        e.preventDefault();
                        handleItemClick(item.id);
                      }}
                      onContextMenu={(e) => {
                        // Prevent context menu from appearing
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onTouchStart={(e) => {
                        // Prevent default touch behavior that triggers share sheet
                        if (!isDraggable) {
                          e.preventDefault();
                        }
                      }}
                      onClick={() => {}} // Keep empty onClick to maintain accessibility
                      whileDrag={{
                        ...config.animations.itemDrag.whileDrag,
                        cursor: 'grabbing'
                      }}
                      whileHover={{
                        scale: isDraggable ? 1.05 : 1,
                        cursor: isDraggable ? 'grab' : 'not-allowed'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`max-h-[120px] object-contain transition-all duration-200 ${
                          itemState.isDisabled ? 'opacity-50' : 'opacity-100'
                        } select-none pointer-events-none`}
                        style={{
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none'
                        }}
                        draggable={false}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      />

                      {/* Red layer for disabled/tried items - but only if NOT in chest */}
                      {itemState.isDisabled && !itemState.isInChest && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-40 rounded-lg pointer-events-none" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Feedback Icons - FIXED: Centered exactly like the progress dots */}
              <AnimatePresence>
                {gameState.currentFeedback.show && (
                  <motion.div
                    className="absolute bottom-20 inset-0 z-30 pointer-events-none flex justify-center"
                    {...config.animations.feedbackIcon}
                  >
                    <img
                      src={gameState.currentFeedback.isCorrect 
                        ? config.globalImages.checkYes 
                        : config.globalImages.checkNo
                      }
                      alt={gameState.currentFeedback.isCorrect ? "Correcto" : "Incorrecto"}
                      className="w-32 h-32 object-contain"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Enhanced Congratulations Overlay */}
        <CongratsOverlay 
          isVisible={showCongrats}
          onComplete={handleCongratsComplete}
          title="¡Tesoro Guardado!"
          subtitle={`Has protegido ${correctItemsCount} de ${privateItemsCount} objetos privados en tu cofre`}
          emoji="🔒"
          bgColor="bg-gradient-to-r from-amber-300/40 to-amber-500/40"
          textColor="text-amber-900"
          autoCloseDelay={config.timing?.congratsDuration || 3000}
        />
      </motion.div>
    </motion.div>
  );
}