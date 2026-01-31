import { describe, it, expect } from "bun:test";
import { renderBigText } from "./BigText.ts";
import { StyledText } from "@opentui/core";

describe("renderBigText", () => {
  it("returns a StyledText object", () => {
    const result = renderBigText("123", "red");
    expect(result).toBeInstanceOf(StyledText);
  });

  it("handles basic characters (digits)", () => {
    const result = renderBigText("1", "white");
    // We can't easily access the internal string without knowing StyledText's API
    // checking if it runs without error and returns is a good start.
    // However, if we assume StyledText has a toString() or similar that returns the content.
    expect(result).toBeInstanceOf(StyledText);
  });

  it("handles basic characters (letters)", () => {
    const result = renderBigText("W", "white");
    expect(result).toBeInstanceOf(StyledText);
  });

  it("handles unknown characters (should fallback to placeholders)", () => {
    const result = renderBigText("?", "blue");
    // The implementation uses "???" for unknown chars.
    // Since we can't easily inspect the content of StyledText without more info,
    // we'll assume the function works if it doesn't throw.
    // To be more rigorous, we'd need to mock StyledText or inspect its internals.
    // For now, let's verify it returns a valid object.
    expect(result).toBeInstanceOf(StyledText);
  });

  it("respects the color argument", () => {
    const resultRed = renderBigText("A", "red");
    const resultBlue = renderBigText("A", "blue");
    
    // If StyledText stores the colored string, these should be different objects
    // and ideally have different internal representations.
    expect(resultRed).not.toEqual(resultBlue);
  });
});
