/**
 * Web Search — optional verification source using Brave Search API.
 *
 * Brave API key is read from:
 *   1. BRAVE_API_KEY env var
 *   2. ~/.openclaw/.brave-api-key file (standard OpenClaw location)
 *
 * If no API key is available, web search is silently skipped.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOME = process.env.HOME || '/home/bk';

function getBraveApiKey() {
  // 1. Environment variable
  if (process.env.BRAVE_API_KEY) return process.env.BRAVE_API_KEY;
  // 2. OpenClaw standard location
  try {
    const keyPath = path.join(HOME, '.openclaw', '.brave-api-key');
    return fs.readFileSync(keyPath, 'utf8').trim();
  } catch { /* not found */ }
  return null;
}

/**
 * Search the web using Brave Search API.
 * @param {string} query - Search query.
 * @param {number} count - Number of results (default 3).
 * @returns {Promise<string>} Formatted search results or empty string.
 */
function braveSearch(query, count = 3) {
  const apiKey = getBraveApiKey();
  if (!apiKey) return Promise.resolve('');

  return new Promise((resolve) => {
    const params = new URLSearchParams({ q: query, count: String(count) });
    const options = {
      hostname: 'api.search.brave.com',
      path: `/res/v1/web/search?${params}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const results = (parsed.web?.results || []).slice(0, count);
          if (results.length === 0) return resolve('');

          const formatted = results.map((r, i) =>
            `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.description || ''}`
          ).join('\n\n');
          resolve(formatted);
        } catch {
          resolve('');
        }
      });
    });

    req.on('error', () => resolve(''));
    req.setTimeout(10000, () => { req.destroy(); resolve(''); });
    req.end();
  });
}

/**
 * Search for multiple claims and aggregate results.
 * Used in "standard" and "deep" verification policies.
 *
 * @param {string[]} queries - List of claim texts to search for.
 * @param {object} config - Plugin config.
 * @returns {Promise<string|null>} Aggregated search results or null.
 */
async function searchWeb(queries, config) {
  const sources = config.knowledge_sources || {};
  if (!sources.enable_web_search) return null;

  const apiKey = getBraveApiKey();
  if (!apiKey) {
    console.log('[cove] Web search skipped: no Brave API key found.');
    return null;
  }

  // Limit to 5 searches to control cost/latency
  const limitedQueries = queries.slice(0, 5);
  const results = [];

  for (const query of limitedQueries) {
    const result = await braveSearch(query, 3);
    if (result) {
      results.push(`Query: "${query}"\n${result}`);
    }
  }

  return results.length > 0 ? results.join('\n\n---\n\n') : null;
}

module.exports = { searchWeb, braveSearch, getBraveApiKey };
