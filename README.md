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


### Guide to use

1. when repo need to use this code review then copy this to .github/workflows/file.yml

```bash
jobs:
  ai-review:
    uses: YOUR_USERNAME/gemini-code-review/.github/workflows/review.yml@v1
    secrets:
      GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```
