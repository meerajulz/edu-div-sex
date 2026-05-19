const AUDIO = '/audio/advance-aventura7/aventura7/juego2';
const IMG = '/image/avanzado/aventura7/juego2';

export const titleAudio = `${AUDIO}/t.mp3`;
export const subtitleAudio = `${AUDIO}/SUBTITLE.mp3`;

export const s1 = {
  questionAudio: `${AUDIO}/S1.mp3`,
  options: [
    { id: 'A', image: `${IMG}/S1-A.png`, audio: `${AUDIO}/S1-A.mp3`, correct: true,  feedbackAudio: `${AUDIO}/S1-A-CORRECT.mp3` },
    { id: 'B', image: `${IMG}/S1-B.png`, audio: `${AUDIO}/S1-B.mp3`, correct: false, feedbackAudio: `${AUDIO}/S1-B-INCORRECT.mp3` },
  ],
};

export const s2 = {
  questionAudio: `${AUDIO}/S2.mp3`,
  options: [
    { id: 'A', image: `${IMG}/S2-A.png`, audio: `${AUDIO}/S2-A.mp3`, correct: true,  feedbackAudio: `${AUDIO}/S2-A-CORRECT.mp3` },
    { id: 'B', image: `${IMG}/S2-B.png`, audio: `${AUDIO}/S2-B.mp3`, correct: false, feedbackAudio: `${AUDIO}/S2-INCORRECT.mp3` },
  ],
};

export const s3 = {
  questionAudio: `${AUDIO}/S3.mp3`,
  imageInitial: `${IMG}/S3-1.png`,
  imageReveal1: `${IMG}/S3-2.png`,
  imageReveal2: `${IMG}/S3-3.png`,
};

export const s4 = {
  questionAudio: `${AUDIO}/S4.mp3`,
  items: [
    { id: '1', image: `${IMG}/S4-1.png`, audio: `${AUDIO}/S4-A.mp3`, correctSlot: 1 },
    { id: '2', image: `${IMG}/S4-2.png`, audio: `${AUDIO}/S4-B.mp3`, correctSlot: 2 },
    { id: '3', image: `${IMG}/S4-3.png`, audio: `${AUDIO}/S4-C.mp3`, correctSlot: 3 },
    { id: '4', image: `${IMG}/S4-4.png`, audio: `${AUDIO}/S4-D.mp3`, correctSlot: 4 },
  ],
};
