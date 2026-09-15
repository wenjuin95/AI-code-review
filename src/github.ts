import * as github from "@actions/github";

export function createGithubClient(token: string) {
  return github.getOctokit(token);
}

export async function createReview(
  token: string,
  body: string
) {
  const octokit = createGithubClient(token);

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = github.context.issue.number;

  return octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    body,
    event: "COMMENT"
  });
}
