'use client';

import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useJuegoCincoGame } from './hooks';
import CongratsOverlay from './CongratsOverlay';

interface JuegoCincoActividad2Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function JuegoCincoActividad2({ isOpen, onClose }: JuegoCincoActividad2Props) {
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
    config
  } = useJuegoCincoGame();

  // Auto-start game when modal opens
  React.useEffect(() => {
    if (isOpen && gameState.phase === 'intro') {
      // Add a small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        startGame();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, gameState.phase, startGame]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetGame();
    onClose();
  };

  const handleCongratsComplete = () => {
    handleClose();
  };

  // FIXED: Better drop zone detection using chest element ID with proper types
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, itemId: string) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
          <div className="absolute top-2 left-2 text-xs bg-black text-white p-2 z-50 rounded">
            Phase: {gameState.phase} | Chest: {gameState.cofreOpen.toString()} | Items: {gameState.itemsVisible.toString()}
            <br />
            In Chest: {gameState.itemStates.filter(s => s.isInChest).map(s => s.id).join(', ')}
          </div>

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
                  className="mx-auto max-h-[300px] object-contain"
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
                      className="max-h-[300px] object-contain"
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
                      className="max-h-[300px] object-contain"
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
                              className="w-16 h-16 object-contain m-1"
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

                  return (
                    <motion.div
                      key={`draggable-${item.id}`} // Unique key for draggable items
                      className={`absolute ${isDraggable ? 'cursor-grab' : 'cursor-not-allowed'}`}
                      style={item.position}
                      initial={config.animations.itemAppear.initial}
                      animate={config.animations.itemAppear.animate}
                      exit={{ 
                        opacity: 0, 
                        scale: 0,
                        transition: { duration: 0.2 }
                      }}
                      transition={{
                        ...config.animations.itemAppear.transition,
                        delay: index * 0.2
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
                      onPointerDown={() => handleItemClick(item.id)} // FIXED: Immediate sound on press
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
                        className={`max-h-[80px] object-contain transition-all duration-200 ${
                          itemState.isDisabled ? 'opacity-50' : 'opacity-100'
                        } select-none pointer-events-none`}
                        draggable={false}
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

          {/* Progress Indicator - only when playing */}
          {gameState.phase !== 'intro' && gameState.phase !== 'completed' && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                {config.items.filter(item => item.isPrivate).map((item) => {
                  const itemState = getItemStateById(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        itemState?.isInChest
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Congratulations Overlay - Delayed to allow chest closing animation */}
        <AnimatePresence>
          {gameState.gameCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }} // Delay for chest closing
            >
              <CongratsOverlay onComplete={handleCongratsComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}