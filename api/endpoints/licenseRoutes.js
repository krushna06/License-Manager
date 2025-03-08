const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/:licenseId', (req, res) => {
        const { licenseId } = req.params;
        console.log(`[API Request] Received request for License ID: ${licenseId}`);

        db.get(`SELECT * FROM licenses WHERE id = ? AND status = 'active'`, [licenseId], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: 'error', message: 'Database error.' });
            }

            if (!row) {
                return res.status(404).json({ status: 'error', message: 'License not found or is inactive/suspended.' });
            }

            res.json({
                status: 'success',
                license: row
            });
        });
    });
    return router;
};
