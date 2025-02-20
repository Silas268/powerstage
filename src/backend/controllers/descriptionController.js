const client = require("../config/db");

// 🔹 Alle Beschreibungen abrufen
exports.getAllDescriptions = async (req, res) => {
    try {
        const query = `SELECT key, description FROM drives.descriptions`;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Beschreibungen:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// 🔹 Eine bestimmte Beschreibung abrufen
exports.getDescriptionByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const query = `SELECT description FROM drives.descriptions WHERE key = $1`;
        const result = await client.query(query, [key]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Keine Beschreibung gefunden" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Abrufen der Beschreibung:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// 🔹 Eine neue Beschreibung hinzufügen
exports.createDescription = async (req, res) => {
    try {
        const { key, description } = req.body;
        const query = `INSERT INTO drives.descriptions (key, description) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(query, [key, description]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Beschreibung:", error);
        res.status(500).send("Fehler beim Speichern der Daten");
    }
};

// 🔹 Eine bestehende Beschreibung aktualisieren
exports.updateDescription = async (req, res) => {
    try {
        const { key } = req.params;
        const { description } = req.body;
        const query = `UPDATE drives.descriptions SET description = $1 WHERE key = $2 RETURNING *`;

        const result = await client.query(query, [description, key]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Keine Beschreibung gefunden" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Beschreibung:", error);
        res.status(500).send("Fehler beim Aktualisieren der Daten");
    }
};

// 🔹 Eine Beschreibung löschen
exports.deleteDescription = async (req, res) => {
    try {
        const { key } = req.params;
        const query = `DELETE FROM drives.descriptions WHERE key = $1 RETURNING *`;

        const result = await client.query(query, [key]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Keine Beschreibung gefunden" });
        }

        res.json({ message: "Beschreibung erfolgreich gelöscht" });
    } catch (error) {
        console.error("Fehler beim Löschen der Beschreibung:", error);
        res.status(500).send("Fehler beim Löschen der Daten");
    }
};
