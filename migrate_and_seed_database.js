#!/usr/bin/env node

const db = require('better-sqlite3')('./db/gddy.sqlite', {verbose: console.log})
const fs = require('fs');
const sql = fs.readFileSync('./db/seed_database.sql', 'utf8');

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

