const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        const { licenseId, hwid } = req.body;

        if (!licenseId || !hwid) {
            return res.status(400).json({ status: 'error', message: 'Missing licenseId or hwid.' });
        }

        db.get(`SELECT hwid FROM licenses WHERE id = ?`, [licenseId], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: 'error', message: 'Database error.' });
            }

            if (!row) {
                return res.status(404).json({ status: 'error', message: 'License not found.' });
            }

            if (row.hwid === null) {
                db.run(`UPDATE licenses SET hwid = ? WHERE id = ?`, [hwid, licenseId], function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ status: 'error', message: 'Failed to update HWID.' });
                    }
                    return res.json({ status: 'success', message: 'HWID successfully updated.' });
                });
            } else if (row.hwid !== hwid) {
                return res.status(403).json({ status: 'error', message: 'Not the same pc' });
            } else {
                return res.json({ status: 'success', message: 'HWID verified successfully.' });
            }
        });
    });

    return router;
};
