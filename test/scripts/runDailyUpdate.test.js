import { describe, it, expect, vi, beforeEach } from "vitest";
import { execSync } from "child_process";

vi.mock("child_process", () => {
  const execSync = vi.fn();
  return {
    default: { execSync },
    execSync,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules(); // forces the next dynamic import() to re-run the script from scratch
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(process, "exit").mockImplementation(() => {}); // never actually kill the test runner
});

describe("runDailyUpdate", () => {
  it("runs both fetch scripts via execSync, in order", async () => {
    execSync.mockImplementation(() => {});

    await import("../../scripts/runDailyUpdate.js");

    expect(execSync).toHaveBeenCalledTimes(2);
    expect(execSync.mock.calls[0][0]).toBe("node scripts/fetchElectionDataVault.js");
    expect(execSync.mock.calls[1][0]).toBe("node scripts/fetchPublicWhip.js");
  });

  it("runs each command with inherited stdio and a consistent working directory", async () => {
    execSync.mockImplementation(() => {});

    await import("../../scripts/runDailyUpdate.js");

    execSync.mock.calls.forEach(([, options]) => {
      expect(options.stdio).toBe("inherit");
      expect(typeof options.cwd).toBe("string");
    });

    // Both calls should run from the same repo root.
    const [firstCwd] = execSync.mock.calls[0].slice(1).map(o => o.cwd);
    const [secondCwd] = execSync.mock.calls[1].slice(1).map(o => o.cwd);
    expect(firstCwd).toBe(secondCwd);
  });

  it("logs a success message and does not exit when both commands succeed", async () => {
    execSync.mockImplementation(() => {});

    await import("../../scripts/runDailyUpdate.js");

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Daily data update completed successfully")
    );
    expect(process.exit).not.toHaveBeenCalled();
  });

  it("stops after the first command fails and never runs the second", async () => {
    execSync.mockImplementationOnce(() => {
      throw new Error("election data vault fetch boom");
    });

    await import("../../scripts/runDailyUpdate.js");

    expect(execSync).toHaveBeenCalledTimes(1);
  });

  it("logs the failure and exits with code 1 when a command fails", async () => {
    execSync.mockImplementationOnce(() => {
      throw new Error("election data vault fetch boom");
    });

    await import("../../scripts/runDailyUpdate.js");

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Daily update failed"),
      expect.any(Error)
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it("still attempts the second command's failure path independently", async () => {
    execSync
      .mockImplementationOnce(() => {}) // first command succeeds
      .mockImplementationOnce(() => {
        throw new Error("public whip fetch boom");
      });

    await import("../../scripts/runDailyUpdate.js");

    expect(execSync).toHaveBeenCalledTimes(2);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});