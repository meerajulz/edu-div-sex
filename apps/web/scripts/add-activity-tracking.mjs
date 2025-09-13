#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of all activity scene pages that need tracking
const pagesToUpdate = [
  'actividad-1/scene2/page.tsx',
  'actividad-1/scene3/page.tsx',
  'actividad-1/scene4/page.tsx',
  'actividad-1/scene5/page.tsx',
  'actividad-1/scene6/page.tsx',
  'actividad-1/scene7/page.tsx',
  'actividad-2/scene1/page.tsx',
  'actividad-2/scene2/page.tsx',
  'actividad-2/scene3/page.tsx',
  'actividad-2/scene4/page.tsx',
  'actividad-2/scene5/page.tsx',
  'actividad-3/scene1/page.tsx',
  'actividad-3/scene2/page.tsx',
  'actividad-4/scene1/page.tsx',
  'actividad-4/scene2/page.tsx',
  'actividad-5/scene1/page.tsx',
  'actividad-5/scene2/page.tsx',
  'actividad-6/scene1/page.tsx',
  'actividad-6/scene2/page.tsx',
  'actividad-6/scene3/page.tsx',
  'actividad-6/scene4/page.tsx',
];

const basePath = path.join(__dirname, '../src/app');

function calculateRelativePath(fromPath) {
  // Calculate how many directories deep we are from src/app
  const depth = fromPath.split('/').filter(p => p).length;
  // We need to go back to app level then to hooks
  return '../'.repeat(depth - 1) + 'hooks/useActivityTracking';
}

function addActivityTracking(filePath) {
  const fullPath = path.join(basePath, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${fullPath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has tracking
  if (content.includes('useActivityTracking')) {
    console.log(`✅ Already has tracking: ${filePath}`);
    return true;
  }

  // Calculate the correct relative import path
  const relativePath = calculateRelativePath(filePath);
  
  // Add import after other imports (look for the last import statement)
  const importRegex = /^import[\s\S]*?from[\s\S]*?;$/gm;
  const imports = content.match(importRegex) || [];
  const lastImport = imports[imports.length - 1];
  
  if (lastImport) {
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;
    
    // Add the import
    const importStatement = `\nimport { useActivityTracking } from '${relativePath}';`;
    content = content.slice(0, insertPosition) + importStatement + content.slice(insertPosition);
  }
  
  // Find the component function and add the hook
  // Look for patterns like "export default function" or "const ComponentName"
  const componentPatterns = [
    /export\s+default\s+function\s+\w+\s*\([^)]*\)\s*{/,
    /const\s+\w+Page\s*[:=]\s*(?:React\.FC\s*)?(?:<[^>]*>)?\s*\([^)]*\)\s*=>\s*{/,
    /function\s+\w+Page\s*\([^)]*\)\s*{/
  ];
  
  let hookAdded = false;
  for (const pattern of componentPatterns) {
    const match = content.match(pattern);
    if (match) {
      const componentStart = match.index + match[0].length;
      
      // Find a good place to add the hook (after other hooks or at the beginning)
      const afterComponent = content.slice(componentStart);
      
      // Look for existing hooks
      const hookPatterns = [
        /const\s+{\s*data:\s*session[^}]*}\s*=\s*useSession\(\);?/,
        /const\s+\w+\s*=\s*use\w+\([^)]*\);?/,
        /useEffect\(/,
        /useState\(/
      ];
      
      let insertIndex = componentStart;
      let lastHookEnd = componentStart;
      
      // Find the last hook
      for (const hookPattern of hookPatterns) {
        const hookMatch = afterComponent.match(hookPattern);
        if (hookMatch && hookMatch.index !== undefined) {
          const absoluteIndex = componentStart + hookMatch.index + hookMatch[0].length;
          if (absoluteIndex > lastHookEnd) {
            lastHookEnd = absoluteIndex;
          }
        }
      }
      
      // Add after the last hook or at the beginning
      if (lastHookEnd > componentStart) {
        insertIndex = lastHookEnd;
        // Find the end of the line
        const nextNewline = content.indexOf('\n', insertIndex);
        if (nextNewline !== -1) {
          insertIndex = nextNewline;
        }
      }
      
      // Add the hook call
      const hookCall = '\n  \n  // Track current activity URL for continue feature\n  useActivityTracking();';
      content = content.slice(0, insertIndex) + hookCall + content.slice(insertIndex);
      hookAdded = true;
      break;
    }
  }
  
  if (!hookAdded) {
    console.log(`⚠️  Could not add hook automatically to: ${filePath}`);
    return false;
  }
  
  // Write the updated content
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Added tracking to: ${filePath}`);
  return true;
}

// Process all files
console.log('🚀 Adding activity tracking to all scene pages...\n');

let successCount = 0;
let skipCount = 0;
let failCount = 0;

for (const file of pagesToUpdate) {
  const result = addActivityTracking(file);
  if (result === true) {
    successCount++;
  } else if (result === false) {
    failCount++;
  }
}

console.log('\n📊 Summary:');
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`⚠️  Failed to update: ${failCount} files`);
console.log('\n✨ Done! All activity pages now track user progress.');