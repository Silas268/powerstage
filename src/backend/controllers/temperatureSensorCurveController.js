const client = require("../config/db");

// Alle Temperatur-Sensordaten abrufen
exports.getAllTemperatureSensorCurves = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM drives.temperature_sensor_curve");
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Einzelne Temperatur-Sensordaten anhand des Typecodes abrufen
exports.getTemperatureSensorCurveByTypeCode = async (req, res) => {
    try {
        const { typecode } = req.params;
        const result = await client.query("SELECT * FROM drives.temperature_sensor_curve WHERE typecode = $1", [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Neuen Datensatz hinzufügen
exports.createTemperatureSensorCurve = async (req, res) => {
    try {
        const { typecode, name, actual_value } = req.body;

        const query = `
            INSERT INTO drives.temperature_sensor_curve (typecode, name, actual_value) 
            VALUES ($1, $2, $3) RETURNING *;
        `;

        const values = [typecode, name, actual_value];
        const result = await client.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Erstellen der Daten:", error);
        res.status(500).send("Fehler beim Erstellen der Daten");
    }
};

// Datensatz aktualisieren
exports.updateTemperatureSensorCurve = async (req, res) => {
    try {
        const { id } = req.params;
        const { typecode, name, actual_value } = req.body;

        const query = `
            UPDATE drives.temperature_sensor_curve
            SET typecode = $1, name = $2, actual_value = $3
            WHERE id = $4 RETURNING *;
        `;

        const values = [typecode, name, actual_value, id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Daten:", error);
        res.status(500).send("Fehler beim Aktualisieren der Daten");
    }
};

// Datensatz löschen
exports.deleteTemperatureSensorCurve = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await client.query("DELETE FROM drives.temperature_sensor_curve WHERE id = $1 RETURNING *;", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.send("Daten erfolgreich gelöscht");
    } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        res.status(500).send("Fehler beim Löschen der Daten");
    }
};
