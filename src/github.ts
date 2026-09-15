import * as github from "@actions/github";

export interface PullRequestFile {
  filename: string;
  patch?: string;
}

export async function getPullRequestDiff(
  token: string
): Promise<string> {

  const octokit = github.getOctokit(token);

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = github.context.issue.number;

  const { data } =
    await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
      per_page: 100
    });

  const files = data as PullRequestFile[];

  return files
    .filter(file => file.patch)
    .map(file => {
      return `
FILE: ${file.filename}

${file.patch}
`;
    })
    .join("\n");
}

export async function postReview(
  token: string,
  body: string
): Promise<void> {

  const octokit = github.getOctokit(token);

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = github.context.issue.number;

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body
  });
}
