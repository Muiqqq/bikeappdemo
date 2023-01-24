const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('../bikingdata.db');

module.exports = db;
