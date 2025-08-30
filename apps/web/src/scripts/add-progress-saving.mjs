#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Game locations and their corresponding activity/scene slugs
const GAMES = [
  // Actividad 1 (JuegoUno already done)
  { path: 'actividad-1/scene4/JuegoDos/JuegoDos.tsx', activity: 'actividad-1', scene: 'scene4', game: 'JuegoDos' },
  { path: 'actividad-1/scene6/JuegoTres/JuegoTres.tsx', activity: 'actividad-1', scene: 'scene6', game: 'JuegoTres' },
  
  // Actividad 2
  { path: 'actividad-2/scene1/JuegoUnoActividad2/JuegoUnoActividad2.tsx', activity: 'actividad-2', scene: 'scene1', game: 'JuegoUnoActividad2' },
  { path: 'actividad-2/scene2/JuegoDosActividad2/JuegoDosActividad2.tsx', activity: 'actividad-2', scene: 'scene2', game: 'JuegoDosActividad2' },
  { path: 'actividad-2/scene3/JuegoTresActividad2/JuegoTresActividad2.tsx', activity: 'actividad-2', scene: 'scene3', game: 'JuegoTresActividad2' },
  { path: 'actividad-2/scene4/JuegoCuatroActividad2/JuegoCuatroActividad2.tsx', activity: 'actividad-2', scene: 'scene4', game: 'JuegoCuatroActividad2' },
  { path: 'actividad-2/scene4/JuegoCincoActividad2/JuegoCincoActividad2.tsx', activity: 'actividad-2', scene: 'scene4', game: 'JuegoCincoActividad2' },
  
  // Actividad 3
  { path: 'actividad-3/scene1/JuegoUnoActividad3/juegoUnoActividad3.tsx', activity: 'actividad-3', scene: 'scene1', game: 'JuegoUnoActividad3' },
  { path: 'actividad-3/scene1/JuegoDosActvidad3/JuegoDosActividad3.tsx', activity: 'actividad-3', scene: 'scene1', game: 'JuegoDosActividad3' },
  { path: 'actividad-3/scene2/JuegoTresActividad3/JuegoTresActividad3.tsx', activity: 'actividad-3', scene: 'scene2', game: 'JuegoTresActividad3' },
  
  // Actividad 4
  { path: 'actividad-4/scene1/JuegoUnoActividad4/JuegoUnoActividad4.tsx', activity: 'actividad-4', scene: 'scene1', game: 'JuegoUnoActividad4' },
  { path: 'actividad-4/scene2/JuegoDosActividad4/JuegoDosActividad4.tsx', activity: 'actividad-4', scene: 'scene2', game: 'JuegoDosActividad4' },
  
  // Actividad 5
  { path: 'actividad-5/scene1/JuegoUnoActividad5/JuegoUnoActividad5.tsx', activity: 'actividad-5', scene: 'scene1', game: 'JuegoUnoActividad5' },
  { path: 'actividad-5/scene1/JuegoDosActividad5/JuegoDosActividad5.tsx', activity: 'actividad-5', scene: 'scene1', game: 'JuegoDosActividad5' },
  { path: 'actividad-5/scene1/JuedoTresActicidad5/JuegoTresActividad5.tsx', activity: 'actividad-5', scene: 'scene1', game: 'JuegoTresActividad5' },
  { path: 'actividad-5/scene2/JuegoCuatroActividad5/JuegoCuatroActividad5.tsx', activity: 'actividad-5', scene: 'scene2', game: 'JuegoCuatroActividad5' },
  
  // Actividad 6
  { path: 'actividad-6/scene1/JuegoUnoActividad6/JuegoUnoActividad6.tsx', activity: 'actividad-6', scene: 'scene1', game: 'JuegoUnoActividad6' },
  { path: 'actividad-6/scene2/JuegoDosActividad6/JuegoDosActividad6.tsx', activity: 'actividad-6', scene: 'scene2', game: 'JuegoDosActividad6' },
  { path: 'actividad-6/scene3/JuegoTresActividad6/JuegoTresActividad6.tsx', activity: 'actividad-6', scene: 'scene3', game: 'JuegoTresActividad6' },
  { path: 'actividad-6/scene4/JuegoCuatroActividad6/JuegoCuatroActividad6.tsx', activity: 'actividad-6', scene: 'scene4', game: 'JuegoCuatroActividad6' },
  { path: 'actividad-6/scene4/JuegoCincoActividad6/JuegoCincoActividad6.tsx', activity: 'actividad-6', scene: 'scene4', game: 'JuegoCincoActividad6' },
  { path: 'actividad-6/scene4/JuegoSeisActividad6/JuegoSeisActividad6.tsx', activity: 'actividad-6', scene: 'scene4', game: 'JuegoSeisActividad6' },
];

const BASE_PATH = '/Users/julianaleon/Desktop/EduDivSexAPP/app/edu-div-sex/apps/web/src/app';

function addProgressSavingToGame(gameInfo) {
  const fullPath = path.join(BASE_PATH, gameInfo.path);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${fullPath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has progress saving
  if (content.includes('useProgressSaver')) {
    console.log(`✅ ${gameInfo.game} already has progress saving`);
    return true;
  }

  // Add import
  const importRegex = /import.*from.*['"]@?\/.*CongratsOverlay['"];/;
  if (importRegex.test(content)) {
    content = content.replace(
      importRegex,
      (match) => `${match}\nimport { useProgressSaver } from '../../../hooks/useProgressSaver';`
    );
  } else {
    // Fallback: add after other imports
    const lastImportIndex = content.lastIndexOf("import");
    const nextLineIndex = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, nextLineIndex) + 
      `\nimport { useProgressSaver } from '../../../hooks/useProgressSaver';` + 
      content.slice(nextLineIndex);
  }

  // Add hook usage
  const componentStartRegex = /const\s+\w+.*?=.*?\(\{[\s\S]*?\}\)\s*=>\s*\{/;
  const match = content.match(componentStartRegex);
  if (match) {
    const insertIndex = match.index + match[0].length;
    content = content.slice(0, insertIndex) + 
      `\n  const { saveProgress } = useProgressSaver();` + 
      content.slice(insertIndex);
  }

  // Find completion handlers and add progress saving
  const completionPatterns = [
    // Pattern 1: onGameComplete callback
    /if\s*\(\s*onGameComplete\s*\)\s*\{\s*onGameComplete\(\)\s*;?\s*\}/g,
    // Pattern 2: setTimeout with onGameComplete
    /setTimeout\s*\(\s*(?:async\s*)?\(\s*\)\s*=>\s*\{[\s\S]*?onGameComplete\(\)\s*;?[\s\S]*?\}\s*,/g,
    // Pattern 3: Direct onClose with onGameComplete
    /onClose\(\)\s*;?\s*if\s*\(\s*onGameComplete\s*\)\s*\{\s*onGameComplete\(\)\s*;?\s*\}/g
  ];

  let modified = false;
  completionPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, (match) => {
        if (match.includes('await saveProgress')) {
          return match; // Already has progress saving
        }
        
        // Add progress saving before the completion
        const progressSaving = `
        // Save progress before completing
        await saveProgress('${gameInfo.activity}', '${gameInfo.scene}', 'completed', 100, {
          game: '${gameInfo.game}',
          completed_at: new Date().toISOString()
        });
        `;
        
        // Make the function async if needed
        let modifiedMatch = match;
        if (!modifiedMatch.includes('async')) {
          modifiedMatch = modifiedMatch.replace(/\(\s*\)\s*=>/, 'async () =>');
        }
        
        // Insert progress saving before onGameComplete
        return modifiedMatch.replace(/(\s*)(if\s*\(\s*onGameComplete\s*\)\s*\{|onGameComplete\(\))/, 
          `${progressSaving}$1$2`);
      });
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Added progress saving to ${gameInfo.game}`);
    return true;
  } else {
    console.log(`⚠️  Could not find completion handler in ${gameInfo.game}`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting progress saving addition to all games...\n');
  
  let successful = 0;
  let failed = 0;

  GAMES.forEach(gameInfo => {
    try {
      if (addProgressSavingToGame(gameInfo)) {
        successful++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${gameInfo.game}:`, error.message);
      failed++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Total processed: ${GAMES.length}`);
}

if (require.main === module) {
  main();
}