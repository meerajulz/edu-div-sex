/**
 * Global TypeScript declarations for Web Audio API extensions
 * and custom properties used throughout the application
 */

declare global {
  interface Window {
    globalGainNode?: GainNode;
    sharedGainNode?: GainNode;
    videoGainNode?: GainNode;
    globalAudioContext?: AudioContext;
    sharedAudioContext?: AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }

  interface HTMLVideoElement {
    _webAudioConnected?: boolean;
  }
}

// This export is needed to make this file a module
export {};