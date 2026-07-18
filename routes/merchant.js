const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// GET semua merchant

router.get("/", async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM merchants ORDER BY id DESC"
        );

const summary = await pool.query(`
    SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE brand='DMI') AS dmi,
        COUNT(*) FILTER (WHERE brand='KMI') AS kmi,
        COUNT(*) FILTER (WHERE brand='KALABIRU') AS kalabiru
    FROM merchants
`);

        res.json({
    data: result.rows,
    summary: summary.rows[0]
});

} catch (err) {

    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });

}

router.post("/", async (req, res) => {

    try {

        const { name, brand } = req.body;

        const result = await pool.query(
            "INSERT INTO merchants(name, brand) VALUES($1,$2) RETURNING *",
            [name, brand]
        );

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

});

// Hapus merchant
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM merchants WHERE id = $1",
            [id]
        );

        res.json({
            success: true,
            message: "Merchant berhasil dihapus"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;