'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { titleAudio, subtitleAudio, situationIntroAudio, situations, finale } from './config';
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onGameComplete: () => void;
}

type GameState = 'intro' | 'situation' | 'finale' | 'completed';
type FinaleStep = 'f1' | 'f2' | 'f3';

function useAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const stop = () => {
    if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; ref.current = null; }
  };
  const play = (src: string): Promise<void> => new Promise((resolve) => {
    stop();
    const a = new Audio(src);
    a.volume = 0.8;
    ref.current = a;
    a.onended = () => resolve();
    a.onerror = () => resolve();
    a.play().catch(() => resolve());
  });
  return { play, stop };
}

export default function JuegoCuatroAventura7({ isVisible, onClose, onGameComplete }: Props) {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [feedbackSymbol, setFeedbackSymbol] = useState<'correct' | 'wrong' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finaleStep, setFinaleStep] = useState<FinaleStep>('f1');
  const { play, stop } = useAudio();

  useEffect(() => {
    if (isVisible) {
      setGameState('intro');
      setRoundIndex(0);
      setCorrectId(null);
      setFeedbackSymbol(null);
      setIsProcessing(false);
      play(titleAudio).then(() => play(subtitleAudio));
    } else {
      stop();
    }
  }, [isVisible]);

  const startSituation = async () => {
    setCorrectId(null);
    setFeedbackSymbol(null);
    setIsProcessing(false);
    setGameState('situation');
    await play(situationIntroAudio);
  };

  const handleOptionClick = async (optionId: string, isCorrect: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const situation = situations[roundIndex];

    if (isCorrect) {
      setCorrectId(optionId);
      await play('/audio/YES.mp3');
      setFeedbackSymbol('correct');
      await play(situation.correctFeedbackAudio);
      setFeedbackSymbol(null);
      // Move to next situation or finale
      const nextIndex = roundIndex + 1;
      if (nextIndex >= situations.length) {
        setGameState('finale');
        setFinaleStep('f1');
        runFinale();
      } else {
        setRoundIndex(nextIndex);
        startSituation();
      }
    } else {
      await play('/audio/NO.mp3');
      setFeedbackSymbol('wrong');
      await play(situation.wrongFeedbackAudio);
      setFeedbackSymbol(null);
      setIsProcessing(false);
    }
  };

  const runFinale = async () => {
    // Step f1: show img1 + img2 (img2 prominent), img1 fades, play f1
    setFinaleStep('f1');
    await play(finale.f1Audio);
    // Step f2: fade img2, show img1, play f2
    setFinaleStep('f2');
    await play(finale.f2Audio);
    // Step f3: fade img1, show text, play f3
    setFinaleStep('f3');
    await play(finale.f3Audio);
    setGameState('completed');
    onGameComplete();
  };

  if (!isVisible) return null;

  const currentSituation = situations[roundIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="juego4-av7-backdrop"
        className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-3xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden min-h-[700px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {gameState !== 'finale' && gameState !== 'completed' && (
            <button
              onClick={() => { stop(); onClose(); }}
              className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105 font-semibold"
            >
              Salir juego
            </button>
          )}

          {/* INTRO */}
          {gameState === 'intro' && (
            <div className="flex flex-col items-center justify-center p-12 min-h-[700px] gap-8">
              <EscucharInstruccionesButton onPlayInstructions={() => play(subtitleAudio)} position="top-right" />
              <motion.h2
                className="text-5xl font-bold text-orange-700 text-center"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              >
                Las pelis porno son pelis, no son verdad
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 text-center max-w-lg"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              >
                Escucha cada situación y elige la imagen correcta.
              </motion.p>
              <motion.button
                onClick={() => { stop(); setRoundIndex(0); startSituation(); }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xl"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              >
                ¡Empezar!
              </motion.button>
            </div>
          )}

          {/* SITUATION */}
          {gameState === 'situation' && (
            <div className="flex flex-col p-6 gap-5 min-h-[700px]">
              {/* Top bar: button left, progress center */}
              <div className="flex items-center mt-2">
                <div className="flex-1 flex justify-start">
                  <button
                    onClick={() => play(situationIntroAudio)}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold text-sm"
                  >
                    🔊 Escuchar instrucciones
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {situations.map((_, i) => (
                    <div key={i} className={`h-3 rounded-full transition-all duration-300 ${
                      i < roundIndex ? 'bg-orange-400 w-8'
                      : i === roundIndex ? 'bg-orange-600 w-12'
                      : 'bg-orange-200 w-8'
                    }`} />
                  ))}
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {roundIndex + 1} / {situations.length}
                  </span>
                </div>
                <div className="flex-1" />
              </div>

              {/* Options */}
              <div className="flex items-center justify-center gap-10 flex-1">
                {currentSituation.options.map((opt) => {
                  const isCorrectSelected = correctId === opt.id;
                  return (
                    <div key={opt.id} className="relative flex flex-col items-center">
                      <motion.button
                        onClick={() => handleOptionClick(opt.id, opt.correct)}
                        disabled={isProcessing}
                        className={`relative overflow-hidden transition-all duration-200 ${
                          isProcessing ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                        }`}
                        style={{ width: '380px', height: '340px' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Image src={opt.image} alt={`Opción ${opt.id}`} fill className="object-contain" unoptimized />

                        {/* Animated circle on correct answer */}
                        {isCorrectSelected && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{ border: '6px solid #22c55e' }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: [0.6, 1.08, 1], opacity: [0, 1, 1] }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              {/* Feedback symbol */}
              {feedbackSymbol && (
                <div className="flex justify-center">
                  <motion.div
                    className={`relative w-24 h-24 rounded-full p-2 ${feedbackSymbol === 'correct' ? 'bg-green-100' : 'bg-red-100'}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  >
                    <Image
                      src={feedbackSymbol === 'correct' ? '/image/avanzado/aventura7/ok-brillo.png' : '/image/avanzado/aventura7/no-brillo.png'}
                      alt={feedbackSymbol === 'correct' ? 'Correcto' : 'Incorrecto'}
                      fill className="object-contain p-1" unoptimized
                    />
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* FINALE */}
          {gameState === 'finale' && (
            <div className="flex flex-col items-center justify-center min-h-[700px] p-8 gap-8">

              {/* f1: img2 prominent, img1 hidden */}
              {finaleStep === 'f1' && (
                <motion.div
                  className="flex items-center justify-center gap-6 w-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="relative rounded-2xl overflow-hidden"
                    style={{ width: '500px', height: '420px' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                  >
                    <Image src={finale.img2} alt="Imagen 2" fill className="object-contain" unoptimized />
                  </motion.div>
                </motion.div>
              )}

              {/* f2: img2 fades, img1 shown */}
              {finaleStep === 'f2' && (
                <motion.div
                  className="flex items-center justify-center w-full"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="relative rounded-2xl overflow-hidden"
                    style={{ width: '460px', height: '400px' }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                  >
                    <Image src={finale.img1} alt="Imagen 1" fill className="object-contain" unoptimized />
                  </motion.div>
                </motion.div>
              )}

              {/* f3: text message */}
              {finaleStep === 'f3' && (
                <motion.div
                  className="flex flex-col items-center justify-center gap-6 text-center px-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                >
                  <motion.p
                    className="text-3xl font-bold text-orange-700 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  >
                    {finale.f3Text}
                  </motion.p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
