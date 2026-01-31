import { Database } from "bun:sqlite";

export class TypingStatsDatabase {
  private db: Database;

  constructor(dbPath: string = "typing_stats.sqlite") {
    this.db = new Database(dbPath, { create: true });
    this.init();
  }

  private init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wpm INTEGER NOT NULL,
        accuracy INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);
  }

  saveSession(wpm: number, accuracy: number) {
    const query = this.db.query(`
      INSERT INTO sessions (wpm, accuracy, created_at)
      VALUES ($wpm, $accuracy, $createdAt)
    `);
    query.run({
      $wpm: wpm,
      $accuracy: accuracy,
      $createdAt: Date.now(),
    });
  }

  getPersonalBestWpm(): number {
    const query = this.db.query(`
      SELECT MAX(wpm) as max_wpm FROM sessions
    `);
    const result = query.get() as { max_wpm: number | null };
    return result?.max_wpm ?? 0;
  }

  getPersonalBestAccuracy(): number {
    const query = this.db.query(`
      SELECT MAX(accuracy) as max_acc FROM sessions
    `);
    const result = query.get() as { max_acc: number | null };
    return result?.max_acc ?? 0;
  }

  getDailyAverages(days: number = 7): Array<{ date: string; avgWpm: number; count: number }> {
    // timestamp is in ms, unixepoch expects seconds
    const query = this.db.query(`
      SELECT 
        strftime('%Y-%m-%d', created_at / 1000, 'unixepoch') as day_date,
        AVG(wpm) as avg_wpm,
        COUNT(*) as count
      FROM sessions
      WHERE created_at >= $limit
      GROUP BY day_date
      ORDER BY day_date DESC
    `);

    const limit = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const results = query.all({ $limit: limit }) as Array<{ day_date: string; avg_wpm: number; count: number }>;
    
    return results.map(r => ({
      date: r.day_date,
      avgWpm: Math.round(r.avg_wpm),
      count: r.count
    }));
  }
  
  close() {
    this.db.close();
  }
}
