/**
 * Simple test runner for the CoV plugin
 */
const { verifyResponse } = require('./src/verify_claims');

async function testCov() {
  console.log("--- Starting CoV Simulation ---");
  
  const mockResponse = "The first human to walk on Mars was Buzz Aldrin in 1969.";
  const mockConfig = {
    policy: "basic",
    auto_correct: true,
    max_correction_attempts: 1
  };
  
  console.log(`Original Response: "${mockResponse}"`);
  
  // This triggers the full extraction/verification flow
  const result = await verifyResponse(mockResponse, mockConfig);
  
  console.log("--- Simulation Complete ---");
  console.log("Verified Results:", JSON.stringify(result, null, 2));
}

testCov().catch(console.error);
