import fs from "node:fs";
import { describe, expect, it } from "vitest";
import Page, { revalidate } from "@/app/page";

describe("app/page.tsx server shell", () => {
  it("exports the planned revalidate policy", () => {
    expect(revalidate).toBe(3600);
  });

  it("does not become a Client Component", () => {
    const source = fs.readFileSync("app/page.tsx", "utf8");

    expect(source).not.toMatch(/^['"]use client['"]/);
  });

  it("renders the page shell", () => {
    expect(Page()).toBeTruthy();
  });
});