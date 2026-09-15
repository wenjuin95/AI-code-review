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
const github = __importStar(require("@actions/github"));
const gemini_1 = require("./gemini");
const parser_1 = require("./parser");
async function main() {
    const githubToken = process.env.GITHUB_TOKEN;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!githubToken) {
        throw new Error("GITHUB_TOKEN is missing");
    }
    if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is missing");
    }
    const model = process.env.GEMINI_MODEL ||
        "gemini-2.5-flash";
    const octokit = github.getOctokit(githubToken);
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const pullNumber = github.context.issue.number;
    const { data: files } = await octokit.rest.pulls.listFiles({
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
    const promptPath = path.join(process.cwd(), "prompts", "code-review.txt");
    let prompt = fs.readFileSync(promptPath, "utf8");
    prompt = prompt.replace("{{DIFF}}", diff);
    console.log("Sending PR to Gemini...");
    const reviews = await (0, gemini_1.reviewCode)(geminiApiKey, model, prompt);
    const body = (0, parser_1.formatReview)(reviews);
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
