const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/licenses.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to open the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.all('SELECT * FROM licenses', (err, rows) => {
    if (err) {
        console.error('Error fetching rows:', err.message);
    } else {
        console.log(rows);
    }
});

db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
