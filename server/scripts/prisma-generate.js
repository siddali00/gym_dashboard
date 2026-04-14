/**
 * Cross-platform entry: on Windows runs PowerShell helper (stops dev server → fixes EPERM on prisma generate).
 * Else: plain prisma generate.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const serverDir = path.join(__dirname, "..");

if (process.platform === "win32") {
  const ps1 = path.join(__dirname, "prisma-generate.ps1");
  const r = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1],
    { stdio: "inherit", cwd: serverDir, shell: false }
  );
  process.exit(r.status ?? 1);
}

const r = spawnSync("npx", ["prisma", "generate"], { stdio: "inherit", cwd: serverDir, shell: true });
process.exit(r.status ?? 1);
