#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of all activity scene pages that need fixing
const pagesToFix = [
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

function fixActivityTracking(filePath) {
  const fullPath = path.join(basePath, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${fullPath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if has the wrong placement
  const wrongPattern = /useEffect\(\(\)\s*=>\s*{\s*\n\s*\/\/\s*Track current activity URL for continue feature\s*\n\s*useActivityTracking\(\);/;
  
  if (wrongPattern.test(content)) {
    // Remove the wrongly placed hook
    content = content.replace(
      /\n\s*\/\/\s*Track current activity URL for continue feature\s*\n\s*useActivityTracking\(\);/g,
      ''
    );
    
    // Now find the right place to add it - right after the component declaration
    // Look for the component function
    const componentPatterns = [
      /(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*{\s*)/,
      /(const\s+\w+Page\s*[:=]\s*(?:React\.FC\s*)?(?:<[^>]*>)?\s*\([^)]*\)\s*=>\s*{\s*)/,
      /(function\s+\w+Page\s*\([^)]*\)\s*{\s*)/
    ];
    
    let fixed = false;
    for (const pattern of componentPatterns) {
      const match = content.match(pattern);
      if (match) {
        const componentStart = match.index + match[0].length;
        
        // Add the hook right after the component opening
        const hookCall = '\n  // Track current activity URL for continue feature\n  useActivityTracking();\n';
        content = content.slice(0, componentStart) + hookCall + content.slice(componentStart);
        fixed = true;
        break;
      }
    }
    
    if (fixed) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed tracking in: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  Could not fix: ${filePath}`);
      return false;
    }
  } else {
    console.log(`✓ Already correct or not found: ${filePath}`);
    return true;
  }
}

// Process all files
console.log('🚀 Fixing activity tracking placement in all scene pages...\n');

let successCount = 0;
let failCount = 0;

for (const file of pagesToFix) {
  const result = fixActivityTracking(file);
  if (result === true) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log('\n📊 Summary:');
console.log(`✅ Successfully fixed: ${successCount} files`);
console.log(`⚠️  Failed to fix: ${failCount} files`);
console.log('\n✨ Done! All activity pages should now have correct hook placement.');