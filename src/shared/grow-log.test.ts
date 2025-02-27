import { GrowLog, LogEntry } from "./grow-log";
import * as sqlite from "sqlite3";
const sqlite3 = sqlite.verbose();
const file = "test.db";
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

beforeEach(() => {
  const db = new sqlite3.Database(file);
  return db.run("DELETE FROM growlogs");
});

test("makes one entry", async () => {
  const grow = new GrowLog(file);
  await grow.track(22, 0.65);

  return grow.log(1, 20).then((entries: [Array<LogEntry>, number]) => {
    const a = entries[0].pop();
    expect(a.temperature).toBeCloseTo(22, 0);
    expect(a.relative_humidity).toBeCloseTo(0.65);
    expect(entries[1]).toBe(1);
  });
});

test("makes multiple entries", async () => {
  const grow = new GrowLog(file);
  for (let i = 0; i < 5; i++) {
    await grow.track(20 + i, i / 5);
    wait(300);
  }

  return grow.log(1, 20).then((entries: [Array<LogEntry>, number]) => {
    for (let i = 0; i < 5; i++) {
      const a = entries[0].pop();
      expect(a.temperature).toBeCloseTo(20 + i, 0);
      expect(a.relative_humidity).toBeCloseTo(i / 5);
    }
    expect(entries[1]).toBe(5);
  });
});
