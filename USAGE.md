# Cove (Chain of Verification) Plugin for OpenClaw

The Cove Plugin brings **Chain of Verification (CoV)** to your OpenClaw pipelines. It intercepts LLM responses, extracts atomic claims, and verifies them against your Memory, Knowledge Base, and Web Search.

## Installation
1. Clone this repository into your OpenClaw `plugins/` directory:
   `git clone [your-repo-url] plugins/cove-verification`
2. Install dependencies:
   `cd plugins/cove-verification && npm install`

## Configuration
Edit `config/default.yaml` to set your verification preferences:

```yaml
policy: "basic" # basic | standard | deep
max_correction_attempts: 1
auto_correct: true 
log_results_to_dashboard: true 
knowledge_sources:
  use_system_memory: true
  document_paths: ["/path/to/docs"]
  enable_web_search: true
```

## How It Works
1. **Extraction**: The plugin automatically detects factual claims in your LLM output.
2. **Verification**: A background sub-agent verifies each claim based on your `policy`.
3. **Correction Loop**: If a claim is flagged as `inaccurate`, the plugin automatically initiates a correction loop to refine the answer.
4. **Logging**: All verification results are logged to the console/system logs.

## Verification Policies
- **Basic**: Verifies against local OpenClaw `memory/`.
- **Standard**: Adds `web_search` to verify facts against the live web.
- **Deep**: Performs multi-step reasoning, cross-referencing sources, and assigns confidence scores.

## Developing
- **Run Tests**: `npm test`
- **Extend**: Add custom verification hooks in `src/verify_claims.js`.
