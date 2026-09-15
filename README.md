# AI-code-review

### Architecture
                  GitHub
                    │
                    │ pull_request
                    ▼
          ┌──────────────────┐
          │ GitHub Action     │
          └────────┬─────────┘
                   │
                   ▼
             Checkout repo
                   │
                   ▼
              Get PR diff
                   │
                   ▼
             Filter files
                   │
                   ▼
            Build AI prompt
                   │
                   ▼
             Gemini API
                   │
                   ▼
             JSON response
                   │
                   ▼
          Validate AI response
                   │
                   ▼
          GitHub PR Review API
                   │
                   ▼
             PR comments
