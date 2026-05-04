const { Pool } = require('pg');
const { db } = require('./config');

const pool = new Pool({
  user: db.DB_USER,
  host: db.DB_HOST,
  database: db.DB_NAME,
  password: db.DB_PASSWORD,
  port: db.DB_PORT,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;