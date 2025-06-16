import Database from 'better-sqlite3';
import {readFileSync} from 'fs';

const db = Database('./db/gddy.sqlite', {verbose: console.log});
const sql = readFileSync('./db/seed_database.sql', 'utf8');

async function migrate() {
  await db.exec(sql, (err) => {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
  });
  console.log('Database seeded');
}

migrate()
  .catch((err) => {
    console.log(err.message);
  })
  .finally(() => {
    db.close();
  });
