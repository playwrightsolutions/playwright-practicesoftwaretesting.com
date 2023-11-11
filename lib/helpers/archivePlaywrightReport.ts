import * as fs from "fs";
import * as path from "path";

// https://discord.com/channels/807756831384403968/1157224510123147354
// Sharing report from artefacts after tests -- Whats the best and easy way to share report after github actions job?
// Can AWS be used for it to generate new unique static website from provided zipped file (default playwright html report with trace screenshots etc).

function archivePlaywrightReport(sourceDir: string, destDir: string): string {
  if (!fs.existsSync(sourceDir)) {
    return `Source directory ${sourceDir} does not exist.`;
  }

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const newDestDir = path.join(destDir, `${timestamp}-playwright-report`);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  copyDirectoryRecursiveSync(sourceDir, newDestDir);
  console.log(`Playwright report archived to ${newDestDir}.`);
  return;
}

function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

function copyDirectoryRecursiveSync(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const files = fs.readdirSync(source);

  for (const file of files) {
    const sourceFilePath = path.join(source, file);
    const destFilePath = path.join(destination, file);

    if (fs.statSync(sourceFilePath).isDirectory()) {
      copyDirectoryRecursiveSync(sourceFilePath, destFilePath);
    } else {
      fs.copyFileSync(sourceFilePath, destFilePath);
    }
  }
}

archivePlaywrightReport("./playwright-report", "./playwright-report-archive");
