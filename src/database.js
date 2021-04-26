const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'felipe',
    database: 'calendario'
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
}


module.exports = {
    query
}


