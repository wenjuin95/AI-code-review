"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const github_js_1 = require("./github.js");
const gemini_js_1 = require("./gemini.js");
function formatReview(issues) {
    if (issues.length === 0) {
        return `
## 🤖 Gemini Code Review

✅ **No significant issues found.**

Gemini did not identify any actionable problems
in this Pull Request.
`;
    }
    let output = `
## 🤖 Gemini Code Review

Found **${issues.length} issue(s)**.

`;
    for (const issue of issues) {
        const emoji = issue.severity === "critical"
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
async function main() {
    const githubToken = process.env.GITHUB_TOKEN;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!githubToken) {
        throw new Error("GITHUB_TOKEN is missing");
    }
    if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is missing");
    }
    const model = process.env.GEMINI_MODEL ??
        "gemini-2.5-flash";
    console.log("Getting Pull Request diff...");
    const diff = await (0, github_js_1.getPullRequestDiff)(githubToken);
    if (!diff.trim()) {
        console.log("No changes found.");
        return;
    }
    const promptPath = path.join(process.cwd(), "prompts", "review.txt");
    let prompt = fs.readFileSync(promptPath, "utf8");
    prompt =
        prompt.replace("{{DIFF}}", diff);
    console.log("Sending code to Gemini...");
    const issues = await (0, gemini_js_1.reviewWithGemini)(geminiApiKey, model, prompt);
    console.log(`Gemini found ${issues.length} issue(s).`);
    const review = formatReview(issues);
    console.log("Posting review to GitHub...");
    await (0, github_js_1.postReview)(githubToken, review);
    console.log("Review posted successfully.");
}
main().catch(error => {
    console.error(error);
    process.exit(1);
});
