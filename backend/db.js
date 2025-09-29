<<<<<<< Updated upstream
const mysql = require('mysql2/promise');
=======
>>>>>>> Stashed changes
const { Pool } = require('pg');

const pool = new Pool({
  host: 'registro_visitantes-db',
  user: 'gerson',
  password: 'senha123',
  database: 'visitantesdb',
  port: 5432,
});

module.exports = pool;
