'use client';

// Types
export type AlexStage = 
  | 'initial' 
  | 'hola' 
  | 'walking' 
  | 'talking' 
  | 'finalWalking' 
  | 'done' 
  | 'sideMoving' 
  | 'static' 
  | 'continueTalking' 
  | 'armUpTalking' 
  | 'finalStatic'
  | 'disappearing';

export type ExpressionSet = {
  eyeOpenMouthClose: string;
  eyeOpenMouthOpen: string;
  eyeCloseMouthOpen: string;
  eyeCloseMouthClose: string;
};

export type WalkingExpressionSet = {
  eyeOpenLegLeft: string;
  eyeOpenLegRight: string;
  eyeCloseLegLeft: string;
  eyeCloseLegRight: string;
};

export type StaticExpressionSet = {
  eyeOpenMouthCloseArmsMiddle: string;
  eyeCloseMouthCloseArmsMiddle: string;
  eyeCloseMouthCloseArmsMiddleHead2: string;
};

export type ArmUpExpressionSet = ExpressionSet & {
  finalPose: string;
};

export type AudioItem = {
  file: string;
  duration: number;
};

// Constants - Expression Sets
export const talkingExpressions: ExpressionSet = {
  eyeOpenMouthClose: '/svg/alex-talk/eye-open-mouth-close-arms-down.svg',
  eyeOpenMouthOpen: '/svg/alex-talk/eye-open-mouth-open-arms-down.svg',
  eyeCloseMouthOpen: '/svg/alex-talk/eye-close-mouth-open-arms-down.svg',
  eyeCloseMouthClose: '/svg/alex-talk/eye-close-mouth-close-arms-down.svg',
};

export const walkingExpressions: WalkingExpressionSet = {
  eyeOpenLegLeft: '/svg/alex-walk/eye-open-mouth-close-arms-down-leg-left.svg',
  eyeOpenLegRight: '/svg/alex-walk/eye-open-mouth-close-arms-down-leg-right.svg',
  eyeCloseLegLeft: '/svg/alex-walk/eye-close-mouth-close-arms-down-leg-left.svg',
  eyeCloseLegRight: '/svg/alex-walk/eye-close-mouth-close-arms-down-leg-right.svg',
};

export const staticExpressions: StaticExpressionSet = {
  eyeOpenMouthCloseArmsMiddle: '/svg/alex-static/eye-open-mouth-close-arms-middle.svg',
  eyeCloseMouthCloseArmsMiddle: '/svg/alex-static/eye-close-mouth-close-arms-middle.svg',
  eyeCloseMouthCloseArmsMiddleHead2: '/svg/alex-static/eye-open-mouth-close-arms-middle-head-2.svg',
};

export const armUpTalkingExpressions: ArmUpExpressionSet = {
  eyeOpenMouthClose: '/svg/alex-talk/alex-eye-open-mouth-close-arm-up.svg',
  eyeOpenMouthOpen: '/svg/alex-talk/alex-eye-open-mouth-open-arm-up.svg',
  eyeCloseMouthOpen: '/svg/alex-talk/alex-eye-close-mouth-open-arm-up.svg',
  eyeCloseMouthClose: '/svg/alex-talk/alex-eye-close-mouth-close-arm-up.svg',
  finalPose: '/svg/alex-talk/0-alex-eye-open-mouth-close-arm-down.svg',
};

// Audio sequences
export const audioSequence: AudioItem[] = [
  { file: '/audio/alex/intro/1-alex.mp3', duration: 2000 }, // Hola!
  { file: '/audio/alex/intro/2-alex.mp3', duration: 1000 },
  { file: '/audio/alex/intro/3-alex.mp3', duration: 4000 },
  { file: '/audio/alex/intro/4-alex.mp3', duration: 2000 },
  { file: '/audio/alex/intro/5-alex.mp3', duration: 2000 },
  { file: '/audio/alex/intro/6-alex.mp3', duration: 4000 },
  { file: '/audio/alex/intro/7-alex.mp3', duration: 2000 },
  { file: '/audio/alex/intro/8-alex.mp3', duration: 2000 }
];

export const continueAudioSequence: AudioItem[] = [
  { file: '/audio/alex/intro/1-alex.mp3', duration: 2000 }, // First audio after kids disappear
  { file: '/audio/alex/intro/2-alex.mp3', duration: 3000 }
];

export const armUpAudioSequence: AudioItem[] = [
  { file: '/audio/alex/intro/9-alex.mp3', duration: 3000 },
  { file: '/audio/alex/intro/10-alex.mp3', duration: 3000 },
  { file: '/audio/alex/intro/11-alex.mp3', duration: 4000 } // Updated from 2000 to 4000 to match actual audio length
];

// Position constants
export const midPosition = {
  top: '90%', // Higher up (more in the back) than before
  scale: 7.6   // Slightly smaller scale (5% less) to appear more in the back
};

export const finalPosition = {
  top: '175%', // Position where talking Alex should be
  scale: 10    // Increased final scale to make him bigger
};

export const sidePosition = {
  top: '220%',  // Much lower on the screen
  scale: 19.2   // Increased by 20% from 16 to 19.2 for final position
};

// Helper functions

// Helper to determine if an image is from a specific expression set
export const isFromExpressionSet = (imagePath: string, setType: string): boolean => {
  if (setType === 'armUp') {
    return imagePath.includes('arm-up');
  } else if (setType === 'talking') {
    return imagePath.includes('alex-talk') && !imagePath.includes('arm-up');
  } else if (setType === 'walking') {
    return imagePath.includes('alex-walk');
  }
  return false;
};

// Helper to determine if eyes are open in current image
export const hasOpenEyes = (imagePath: string): boolean => {
  return !imagePath.includes('eye-close');
};

// Helper to determine if mouth is open in current image
export const hasMouthOpen = (imagePath: string): boolean => {
  return imagePath.includes('mouth-open');
};

// Helper to determine if left leg is showing in walking pose
export const hasLeftLeg = (imagePath: string): boolean => {
  return imagePath.includes('leg-left');
};