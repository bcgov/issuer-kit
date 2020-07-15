import fs from "fs";
import path from "path";

export function loadFileAsText(fileName: string): string {
  return fs.readFileSync(
    path.resolve(
      __dirname,
      "..",
      "..",
      "config",
      fileName
    ),
    "utf8"
  );
}

export function loadJSON(fileName: string): object {
  const txtContent = loadFileAsText(fileName);
  return JSON.parse(txtContent);
}
