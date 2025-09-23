# Escuchar Instrucciones Button Implementation Guide

This document provides step-by-step instructions for adding the "Escuchar instrucciones" button to game modals across all activities.

## Overview

The `EscucharInstruccionesButton` is a reusable component that allows users to replay game instructions/title audio at any time during gameplay. It has been implemented across Activities 1-3 and needs to be added to remaining activities.

## Component Location

**Component File**: `/app/components/EscucharInstruccionesButton/EscucharInstruccionesButton.tsx`

## Available Positions

The button supports multiple positioning options:

- `'top-right'`: `top-4 right-48` (default)
- `'below-exit'`: `top-16 right-4` (below the exit button)
- `'top-left'`: `top-4 left-4` (top left corner)
- `'side-by-side'`: `top-4 right-40` (side by side with exit button)

## Implementation Steps

### Step 1: Add Import
Add the component import to the game's main TSX file:

```tsx
import EscucharInstruccionesButton from '../../../components/EscucharInstruccionesButton/EscucharInstruccionesButton';
```

### Step 2: Create Handler Function
Add a handler function that plays the appropriate audio:

#### For Simple Title Audio:
```tsx
const handleListenInstructions = () => {
  // Play the title audio
  playAudio('/path/to/title/audio.mp3');
};
```

#### For Gender-Specific Audio:
```tsx
const handleListenInstructions = useCallback(() => {
  // Play the gender-specific title audio
  playAudio(gameConfig.title.audio);
}, [playAudio, gameConfig.title.audio]);
```

#### For Title + Subtitle Audio:
```tsx
const handleListenInstructions = async () => {
  // Play title audio, then subtitle audio
  await playAudio(config.globalAudio.title);
  setTimeout(async () => {
    await playAudio(config.globalAudio.subtitle);
  }, 1000); // Small delay between title and subtitle
};
```

### Step 3: Add Button to Modal
Place the button in the modal, typically near the close button:

```tsx
{/* Listen Instructions Button */}
<EscucharInstruccionesButton
  onPlayInstructions={handleListenInstructions}
  position="side-by-side"
/>

{/* Close Button */}
<button
  onClick={handleClose}
  className="absolute top-4 right-4 z-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 font-semibold"
>
  Salir juego
</button>
```

## Implementation Status

### ✅ COMPLETED - Activities 1-3

#### Activity 1
- **Scene 1 JuegoUno** (`/actividad-1/scene1/JuegoUno/JuegoUno.tsx`)
  - Audio: `/audio/actividad-1/escena_1/juego_1_cris.mp3`
  - Position: `below-exit`

- **Scene 6 JuegoTres** (`/actividad-1/scene6/JuegoTres/JuegoTres.tsx`)
  - Audio: Title + Instructions sequence
  - Position: `top-right`

#### Activity 2
- **Scene 1 JuegoUno** (`/actividad-2/scene1/JuegoUnoActividad2/JuegoUnoActividad2.tsx`)
  - Audio: `/audio/actividad-2/juego1/esta-bien-contar.mp3`
  - Position: `top-right`
  - Special: Added green "Escuchar situación" button for current situation

- **Scene 2 JuegoDos** (`/actividad-2/scene2/JuegoDosActividad2/JuegoDosActividad2.tsx`)
  - Audio: Title + Subtitle sequence
  - Position: `top-right`

- **Scene 3 JuegoTres** (`/actividad-2/scene3/JuegoTresActividad2/JuegoTresActividad2.tsx`)
  - Audio: Title + Subtitle sequence
  - Position: `top-right`

- **Scene 4 JuegoCuatro** (`/actividad-2/scene4/JuegoCuatroActividad2/JuegoCuatroActividad2.tsx`)
  - Audio: Title + Subtitle sequence
  - Position: `top-right`

- **Scene 5 JuegoCinco** (`/actividad-2/scene5/JuegoCincoActividad2/JuegoCincoActividad2.tsx`)
  - Audio: Title audio (22 seconds)
  - Position: `top-right`

#### Activity 3
- **Scene 1 JuegoUno** (`/actividad-3/scene1/JuegoUnoActividad3/juegoUnoActividad3.tsx`)
  - Audio: `/audio/actividad-3/juego1/title.mp3`
  - Position: `side-by-side`

- **Scene 1 JuegoDos** (`/actividad-3/scene1/JuegoDosActvidad3/JuegoDosActividad3.tsx`)
  - Audio: Gender-specific
    - Female: `/audio/actividad-3/juego2/chicas/title.mp3`
    - Male: `/audio/actividad-3/juego2/chicos/title.mp3`
  - Position: `top-right`

- **Scene 2 JuegoTres** (`/actividad-3/scene2/JuegoTresActividad3/JuegoTresActividad3.tsx`)
  - Audio: Gender-specific
    - Female: `/audio/actividad-3/juego3/female/title.mp3`
    - Male: `/audio/actividad-3/juego3/males/title.mp3`
  - Position: `top-right`

### 🚧 PENDING - Activities 4-6

Need to implement the button for all games in:
- **Activity 4**: All scenes and games
- **Activity 5**: All scenes and games
- **Activity 6**: All scenes and games

## Common Patterns

### Audio Hook Requirements
Most games need the `playAudio` function to be available. Check if it's already exported from hooks:

1. Look for `playAudio` in the hook's return object
2. If not available, add it to the hook's return
3. Update the component to destructure `playAudio`

### Finding Audio Paths
Check the game's config file for:
- `titleAudio.path`
- `globalAudio.title`
- `globalAudio.titleGame`
- `genderConfig.male/female.title.audio`

### Positioning Guidelines
- Use `side-by-side` for cleaner layouts when possible
- Use `top-right` when there's enough space
- Use `below-exit` if buttons need to be stacked
- Use `top-left` to avoid conflicts with other UI elements

## Testing Checklist

After implementation, verify:
- [ ] Button appears in the correct position
- [ ] Button plays the correct audio when clicked
- [ ] Button doesn't overlap with other UI elements
- [ ] Audio respects volume control settings
- [ ] Gender-specific audio plays correctly (if applicable)
- [ ] Button is properly styled (blue background, white text)

## Files to Update per Game

1. **Main game component** (`.tsx` file)
   - Add import
   - Add handler function
   - Add button placement

2. **Hooks file** (if `playAudio` not available)
   - Export `playAudio` function

3. **Config file** (if missing audio paths)
   - Add title/subtitle audio paths

## Notes

- The component is fully reusable and handles all styling internally
- Always use the `playAudio` function from the game's audio manager hooks
- For gender-specific games, ensure the handler accesses the correct audio path
- The button text is fixed as "🔊 Escuchar instrucciones"
- Button is disabled during audio playback automatically if using proper audio hooks