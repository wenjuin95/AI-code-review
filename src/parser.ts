import type { GeminiReview } from "./gemini";

export function formatReview(
  reviews: GeminiReview[]
): string {
  if (reviews.length === 0) {
    return `## 🤖 Gemini Code Review

✅ No significant issues found.

The AI reviewer did not identify any actionable problems in this pull request.
`;
  }

  let output = `## 🤖 Gemini Code Review\n\n`;

  output += `Found **${reviews.length} issue(s)**.\n\n`;

  for (const review of reviews) {
    output += `### ${severityEmoji(review.severity)} ${review.title}\n\n`;

    output += `**Severity:** \`${review.severity}\`\n\n`;

    output += `**File:** \`${review.file}:${review.line}\`\n\n`;

    output += `${review.description}\n\n`;

    output += `**Suggestion:**\n\n`;

    output += `${review.suggestion}\n\n`;

    output += `---\n\n`;
  }

  return output;
}

function severityEmoji(
  severity: GeminiReview["severity"]
): string {
  switch (severity) {
    case "critical":
      return "🚨";

    case "high":
      return "🔴";

    case "medium":
      return "🟠";

    case "low":
      return "🟡";
  }
}
