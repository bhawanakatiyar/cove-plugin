/**
 * Logger for CoV Plugin
 * Uses standard OpenClaw platform-agnostic logging/events.
 */

async function logInaccuracy(claim, verdict) {
  console.log(`[CoV Plugin] Inaccuracy Detected: ${claim.text}`);
  console.log(`Reasoning: ${verdict.reasoning}`);
  
  // Standard logging for OpenClaw
  // Using process.stdout or a generic event emitter
  // avoids dependency on custom CSM tools.
  return true;
}

module.exports = { logInaccuracy };
