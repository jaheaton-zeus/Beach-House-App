/**
 * Restores the missing build step on Workers Builds.
 *
 * This project's Workers Builds trigger has no build command — a leftover from
 * when the repo served a static "Coming Soon" page and needed none. Its deploy
 * command is a bare `npx wrangler deploy`, which detects the OpenNext project
 * and hands off to `opennextjs-cloudflare deploy`. That handoff happens before
 * wrangler runs any build of its own, so without a build step it exits with
 * "Could not find compiled Open Next config, did you run the build command?".
 *
 * npm's postinstall hook is the one point in the runner's sequence
 * (clean-install → deploy command) where the repo can still get a word in.
 *
 * The cleaner arrangement is to set the trigger's build command to
 * `npx opennextjs-cloudflare build` in the dashboard; once that is done, this
 * script and its postinstall hook can be deleted.
 */
import { spawnSync } from "node:child_process";

// Injected by Workers Builds only, so a developer's `npm install` is untouched.
if (!process.env.WORKERS_CI) {
  process.exit(0);
}

console.log("Workers Builds detected — running the OpenNext build.");

const result = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
