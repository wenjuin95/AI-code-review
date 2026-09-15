# AI-code-review

An AI-powered GitHub Action that automatically reviews Pull Requests using Google Gemini.
It analyzes the changes in a Pull Request, identifies meaningful issues such as bugs and security vulnerabilities, and posts the review directly to the Pull Request.

## ✨Features

- 🤖 AI-powered code review using Google Gemini
- 🔍 Reviews Pull Request diffs automatically
- 🐛 Detects potential bugs and incorrect logic
- 🔐 Identifies security vulnerabilities
- 🛡️ Checks authentication, authorization, and input validation
- ⚡ Looks for performance problems and resource leaks
- 🔄 Detects possible race conditions and breaking changes
- 💬 Posts the review directly to the Pull Request
- 🔌 Reusable across multiple GitHub repositories
- 🔒 Does not execute Pull Request code

## 🏗️Architecture
The project is designed as a reusable GitHub Action.
```
┌──────────────────────┐
│     GitHub Pull      │
│       Request        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   GitHub Actions     │
│      Workflow        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  AI Code Review      │
│      Action          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  GitHub REST API     │
│                      │
│  Get changed files   │
│  and Pull Request    │
│       diff           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Google Gemini     │
│                      │
│    Analyze code      │
│    Return JSON       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Format Review      │
│                      │
│  Severity            │
│  File                │
│  Line                │
│  Description         │
│  Suggestion          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    GitHub Pull       │
│    Request Comment   │
└──────────────────────┘
```

## 🎯What Problem Does It Solve?

Code review is an important part of software development, but manual review can be time-consuming.

Developers need to:
1. Read the Pull Request
2. Understand the changes
3. Look for bugs
4. Check security issues
5. Think about edge cases
6. Leave feedback

> For small teams or individual developers, some problems can easily be overlooked.
<br>

This Action provides an additional automated layer of review.

Instead of:
```
Pull Request
     │
     ▼
Manual Review
     │
     ▼
Merge
```
you can have:
```
Pull Request
     │
     ├──────────────► AI Review
     │                    │
     │                    ▼
     │              Potential Issues
     │
     ▼
Manual Review
     │
     ▼
Merge
```
> The AI review is not intended to replace human developers. It acts as an additional reviewer that can help identify issues before the code is merged.
<br>

## 💡Benefits Does It Provide?
1. **Fast Feedback**: Help catch obvious problems before a human reviewer spends time reviewing the entire change.
2. **Security Awareness**: Look for security-related problems such as:
```
  - SQL injection
  - Authentication problems
  - Authorization issues
  - Missing input validation
  - Unsafe handling of user-controlled data
```
3. **Reusable Across Projects**: The Action can be used by multiple repositories.

## How to Use
### 1. Add the Gemini API Key at your repo
The repository using the Action needs a Gemini API key.

Go to:
```
Repository
   ↓
Settings
   ↓
Secrets and variables
   ↓
Actions
   ↓
New repository secret
```
Create:
```
Name:
GEMINI_API_KEY

Value:
YOUR_GEMINI_API_KEY
```
> Never commit the API key to your repository.
<br>

### 2. Create the GitHub Actions Workflow at your repo
Create:
```
.github/workflows/gemini-review.yml
```
Add:
```
name: Gemini Code Review

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest

    steps:
      - name: Gemini Code Review
        uses: wenjuin95/AI-code-review@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          GEMINI_MODEL: MODAL_YOU_LIKE
```

### 3. Create a Pull Request
Once the workflow is pushed:
```
Create Pull Request
        │
        ▼
GitHub Actions starts
        │
        ▼
Gemini reviews the changes
        │
        ▼
Review appears on the Pull Request
```

## ⚠️Limitations
This project is currently designed as a lightweight AI-assisted Pull Request reviewer.

Current limitations include:

- Reviews Pull Request diffs rather than the entire repository
- Large Pull Requests may require diff-size handling
- Reviews are posted as Pull Request comments rather than inline code comments
- AI-generated feedback can be incorrect and should be verified by developers
- The Action does not replace human code review
- Fork Pull Requests have different GitHub Actions secret restrictions
