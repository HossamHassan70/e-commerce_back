const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',
  database: 'Ecommerce', 
  password: '12345',       
  port: 5432,
});

pool.connect()
  .then(() => console.log(' Connected to PostgreSQL successfully'))
  .catch(err => console.error(' Database connection error:', err));

module.exports = pool;
