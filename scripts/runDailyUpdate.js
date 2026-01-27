import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function run(command, label) {
  console.log(`\n▶ ${label}`);
  execSync(command, {
    cwd: rootDir,
    stdio: "inherit",
  });
}

try {
  run("node scripts/fetchElectionDataVault.js", "Fetching Election Data Vault");
  run("node scripts/fetchPublicWhip.js", "Fetching Public Whip data");

  run("python scripts/aggregate_publicwhip.py", "Aggregating MP stats");
  run("python scripts/compute_party_averages.py", "Computing party averages");

  console.log("\nDaily data update completed successfully");
} catch (error) {
  console.error("\nDaily update failed");
  process.exit(1);
}
