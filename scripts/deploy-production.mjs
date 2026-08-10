import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const runGit = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const branch = runGit("branch", "--show-current");
const sha = runGit("rev-parse", "HEAD");

function assertReleaseTree() {
  if (branch !== "main") {
    throw new Error(`Production deploy refused: expected branch main, found ${branch || "detached HEAD"}.`);
  }
  if (runGit("status", "--porcelain")) {
    throw new Error("Production deploy refused: the worktree is not clean.");
  }
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function enableWorkersDev() {
  const configPath = "dist/server/wrangler.json";
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  writeFileSync(configPath, JSON.stringify({ ...config, workers_dev: true }));
}

assertReleaseTree();
const productionEnv = {
  ...process.env,
  SITE_URL: "https://chukadele.com",
  ALLOW_INDEXING: "true",
};
run("npm", ["run", "build"], productionEnv);
assertReleaseTree();
enableWorkersDev();
run("./node_modules/.bin/wrangler", [
  "deploy",
  "--config", "dist/server/wrangler.json",
  "--name", "chuka-personal-site",
  "--var", `DEPLOY_SHA:${sha}`,
  "--var", "SITE_URL:https://chukadele.com",
  "--var", "ALLOW_INDEXING:true",
], { ...productionEnv, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" });
