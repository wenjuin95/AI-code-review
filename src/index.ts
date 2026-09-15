import * as fs from "fs";
import * as path from "path";

import {
  getPullRequestDiff,
  postReview
} from "./github.js";

import {
  reviewWithGemini,
  ReviewIssue
} from "./gemini.js";

function formatReview(
  issues: ReviewIssue[]
): string {

  if (issues.length === 0) {
    return `
## Code Review

✅ **No significant issues found.**

Gemini did not identify any actionable problems
in this Pull Request.
`;
  }

  let output = `
## Code Review

Found **${issues.length} issue(s)**.

`;

  for (const issue of issues) {

    const emoji =
      issue.severity === "critical"
        ? "🚨"
        : issue.severity === "high"
        ? "🔴"
        : issue.severity === "medium"
        ? "🟠"
        : "🟡";

    output += `
### ${emoji} ${issue.title}

**Severity:** \`${issue.severity}\`

**File:** \`${issue.file}:${issue.line}\`

${issue.description}

**Suggestion:**

${issue.suggestion}

---
`;
  }

  return output;
}

async function main(): Promise<void> {

  const githubToken = process.env.GITHUB_TOKEN;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = process.env.GEMINI_MODEL;

  if (!model) {
	throw new Error("GEMINI_MODEL is missing");
  }

  console.log("Getting Pull Request diff...");

  const diff =
    await getPullRequestDiff(githubToken);

  if (!diff.trim()) {
    console.log("No changes found.");
    return;
  }

  const promptPath = path.join(
    __dirname,
	"..",
    "prompts",
    "review.txt"
  );

  let prompt =
    fs.readFileSync(promptPath, "utf8");

  prompt =
    prompt.replace("{{DIFF}}", diff);

  console.log("Sending code to Gemini...");

  const issues =
    await reviewWithGemini(
      geminiApiKey,
      model,
      prompt
    );

  console.log(
    `Gemini found ${issues.length} issue(s).`
  );

  const review =
    formatReview(issues);

  console.log("Posting review to GitHub...");

  await postReview(
    githubToken,
    review
  );

  console.log("Review posted successfully.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
