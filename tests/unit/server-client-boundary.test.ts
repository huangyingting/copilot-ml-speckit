import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const clientRoots = ["components"];

function collectSourceFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(entryPath);
    if (/\.(ts|tsx)$/.test(entry.name)) return [entryPath];
    return [];
  });
}

describe("server/client boundary", () => {
  it("prevents client components from importing server-only modules", () => {
    const violations = clientRoots
      .flatMap((root) => collectSourceFiles(root))
      .filter((sourceFile) => {
        const source = fs.readFileSync(sourceFile, "utf8");
        return /from ["']@\/lib\/server\//.test(source) || /from ["']\.\.\/\.\.\/lib\/server\//.test(source);
      });

    expect(violations).toEqual([]);
  });
});