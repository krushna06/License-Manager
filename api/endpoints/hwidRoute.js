const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        const { licenseId, hwid } = req.body;

        if (!licenseId || !hwid) {
            return res.status(400).json({ status: 'error', message: 'Missing licenseId or hwid.' });
        }

        db.run(`UPDATE licenses SET hwid = ? WHERE id = ?`, [hwid, licenseId], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: 'error', message: 'Database error.' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ status: 'error', message: 'License not found or unable to update HWID.' });
            }

            res.json({
                status: 'success',
                message: 'HWID successfully updated.'
            });
        });
    });

    return router;
};