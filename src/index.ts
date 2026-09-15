import * as fs from "fs";
import * as path from "path";

import * as github from "@actions/github";
import { reviewCode } from "./gemini";
import { formatReview } from "./parser";

async function main() {
  const githubToken = process.env.GITHUB_TOKEN;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!githubToken) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model =
    process.env.GEMINI_MODEL ||
    "gemini-2.5-flash";

  const octokit = github.getOctokit(githubToken);

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = github.context.issue.number;

  const { data: files } =
    await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100
    });

  const diff = files
    .filter(file => file.patch)
    .map(file => {
      return `
FILE: ${file.filename}

${file.patch}
`;
    })
    .join("\n");

  if (!diff.trim()) {
    console.log("No reviewable diff found.");
    return;
  }

  const promptPath = path.join(
    process.cwd(),
    "prompts",
    "code-review.txt"
  );

  let prompt = fs.readFileSync(promptPath, "utf8");

  prompt = prompt.replace(
    "{{DIFF}}",
    diff
  );

  console.log("Sending PR to Gemini...");

  const reviews = await reviewCode(
    geminiApiKey,
    model,
    prompt
  );

  const body = formatReview(reviews);

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body
  });

  console.log("Review posted.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
