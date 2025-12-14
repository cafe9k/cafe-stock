import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "cafe_stock.db");
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts_code TEXT NOT NULL,
    ann_date TEXT NOT NULL,
    ann_type TEXT,
    title TEXT,
    content TEXT,
    pub_time TEXT,
    UNIQUE(ts_code, ann_date, title)
  );

  CREATE INDEX IF NOT EXISTS idx_ann_date_pub_time ON announcements (ann_date DESC, pub_time DESC);
`);

export const insertAnnouncements = (items: any[]) => {
	const insert = db.prepare(`
    INSERT OR IGNORE INTO announcements (ts_code, ann_date, ann_type, title, content, pub_time)
    VALUES (@ts_code, @ann_date, @ann_type, @title, @content, @pub_time)
  `);

	const insertMany = db.transaction((announcements) => {
		for (const ann of announcements) {
			insert.run({
				ts_code: ann.ts_code || null,
				ann_date: ann.ann_date || null,
				ann_type: ann.ann_type || null,
				title: ann.title || null,
				content: ann.content || null,
				pub_time: ann.pub_time || null,
			});
		}
	});

	insertMany(items);
};

export const getLatestAnnDate = () => {
	const row = db.prepare("SELECT MAX(ann_date) as max_date FROM announcements").get() as { max_date: string };
	return row?.max_date || null;
};

export const getAnnouncements = (limit: number, offset: number) => {
	return db
		.prepare(
			`
    SELECT * FROM announcements 
    ORDER BY ann_date DESC, pub_time DESC 
    LIMIT ? OFFSET ?
  `
		)
		.all(limit, offset);
};

export const countAnnouncements = () => {
	const row = db.prepare("SELECT COUNT(*) as count FROM announcements").get() as { count: number };
	return row.count;
};

export default db;
