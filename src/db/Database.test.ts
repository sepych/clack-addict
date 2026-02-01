import { describe, it, expect, afterAll } from "bun:test";
import { TypingStatsDatabase } from "./Database";
import { unlinkSync } from "node:fs";

const TEST_DB = "test_stats.sqlite";

describe("TypingStatsDatabase", () => {
  const db = new TypingStatsDatabase(TEST_DB);

  afterAll(() => {
    db.close();
    try {
      unlinkSync(TEST_DB);
    } catch (_e) {
      // ignore
    }
  });

  it("saves a session and retrieves personal best", () => {
    db.saveSession(60, 95);
    db.saveSession(80, 98);
    db.saveSession(40, 100);

    expect(db.getPersonalBestWpm()).toBe(80);
    expect(db.getPersonalBestAccuracy()).toBe(100);
  });

  it("calculates daily averages", () => {
    // Clean start for logic check would be ideal, but we can append
    // current time is used, so it will fall into today
    const stats = db.getDailyAverages(7);
    expect(stats.length).toBeGreaterThan(0);
    const firstStat = stats[0];
    if (firstStat) {
      expect(firstStat.count).toBeGreaterThanOrEqual(3);
    }
  });
});
