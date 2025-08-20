// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Get the base configurations
const baseConfigs = compat.extends("next/core-web-vitals", "next/typescript");

// Create a configuration to override warnings
const warningsToOffConfig = {
  rules: {
    // This sets all rules that are warnings (level 1) to off (level 0)
    // It will be applied to all files
  },
  linterOptions: {
    // Only report errors, not warnings
    reportUnusedDisableDirectives: "error",
  }
};

// Function to process configs and change warnings to off
function processConfigs(configs) {
  return configs.map(config => {
    // Create a new config object to avoid mutation
    const newConfig = { ...config };
    
    // If rules exist, process them
    if (newConfig.rules) {
      const processedRules = {};
      
      // For each rule, if it's a warning, change it to off
      Object.entries(newConfig.rules).forEach(([key, value]) => {
        // Check if the rule is a warning
        if (value === 1 || value === "warn" || 
            (Array.isArray(value) && (value[0] === 1 || value[0] === "warn"))) {
          
          // If it's an array with options, preserve the options
          if (Array.isArray(value)) {
            processedRules[key] = [0, ...value.slice(1)];
          } else {
            processedRules[key] = 0;
          }
        } else {
          // Keep other rules as they are
          processedRules[key] = value;
        }
      });
      
      newConfig.rules = processedRules;
    }
    
    return newConfig;
  });
}

// Process the base configs to change warnings to off
const processedConfigs = processConfigs(baseConfigs);

// Create the final config array
const eslintConfig = [
  ...processedConfigs,
  warningsToOffConfig,
];

export default eslintConfig;