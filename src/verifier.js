const fs = require('fs');
const path = require('path');

/**
 * Loads system configuration to respect user's model and environment choices.
 */
function getSystemConfig() {
  try {
    // Assuming standard path for OpenClaw gateway configuration
    const configPath = path.join(process.env.HOME, '.openclaw', 'gateway.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (err) {
    console.error("Could not load system config, falling back to defaults:", err);
  }
  return { model: 'gemini' }; // Fallback
}

const systemConfig = getSystemConfig();
const model = systemConfig.model || 'gemini';

console.log(`Plugin initialized with system model: ${model}`);

/**
 * Active CoV Verification Engine
 */
async function activeVerification(modelResponse, policy = 'basic') {
  console.log(`Analyzing response for claims using model: ${model}...`);
  // Extraction and verification logic here...
}

module.exports = { activeVerification, model };
