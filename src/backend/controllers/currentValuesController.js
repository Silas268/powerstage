const pool = require("../config/db"); // Verbindung zur Datenbank

// 🔹 Alle CurrentValues abrufen
exports.getAllCurrentValues = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT cv.*, p.name AS powerstage_name 
            FROM drives.currentvalues cv
            JOIN drives.powerstage p ON cv.typecode = p.typecode
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der CurrentValues:", error);
        res.status(500).send("Serverfehler");
    }
};

// 🔹 CurrentValues für eine bestimmte Powerstage abrufen
exports.getCurrentValuesByTypecode = async (req, res) => {
    const { typecode } = req.params;
    try {
        const result = await pool.query(`
            SELECT cv.*, p.name AS powerstage_name 
            FROM drives.currentvalues cv
            JOIN drives.powerstage p ON cv.typecode = p.typecode
            WHERE cv.typecode = $1
        `, [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Keine Daten für diesen TypeCode gefunden");
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen von CurrentValues:", error);
        res.status(500).send("Serverfehler");
    }
};

// 🔹 Einen neuen CurrentValue hinzufügen
exports.createCurrentValue = async (req, res) => {
    const { typecode, voltage, frequency, value } = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO drives.currentvalues (typecode, voltage, frequency, value)
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [typecode, voltage, frequency, value]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Erstellen eines CurrentValue:", error);
        res.status(500).send("Serverfehler");
    }
};

// 🔹 Einen CurrentValue aktualisieren
exports.updateCurrentValue = async (req, res) => {
    const { id } = req.params;
    const { typecode, voltage, frequency, value } = req.body;

    try {
        const result = await pool.query(`
            UPDATE drives.currentvalues 
            SET typecode = $1, voltage = $2, frequency = $3, value = $4
            WHERE id = $5 RETURNING *
        `, [typecode, voltage, frequency, value, id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Eintrag nicht gefunden");
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren eines CurrentValue:", error);
        res.status(500).send("Serverfehler");
    }
};

// 🔹 Einen CurrentValue löschen
exports.deleteCurrentValue = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM drives.currentvalues WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Eintrag nicht gefunden");
        }

        res.json({ message: "Eintrag erfolgreich gelöscht" });
    } catch (error) {
        console.error("Fehler beim Löschen eines CurrentValue:", error);
        res.status(500).send("Serverfehler");
    }
};
