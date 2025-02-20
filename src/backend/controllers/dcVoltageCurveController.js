const client = require("../config/db");

// Alle DC-Voltage-Daten abrufen
exports.getAllDcVoltageCurves = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM drives.dc_voltage_curve");
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der DC-Voltage-Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Einzelne DC-Voltage-Daten nach TypeCode abrufen
exports.getDcVoltageCurveByTypeCode = async (req, res) => {
    try {
        const { typecode } = req.params;
        const result = await client.query("SELECT * FROM drives.dc_voltage_curve WHERE typecode = $1", [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der DC-Voltage-Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Neuen DC-Voltage-Datensatz hinzufügen
exports.createDcVoltageCurve = async (req, res) => {
    try {
        const { typecode, name, actual_value } = req.body;

        const query = `
            INSERT INTO drives.dc_voltage_curve (typecode, name, actual_value) 
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [typecode, name, actual_value];
        const result = await client.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Erstellen der DC-Voltage-Daten:", error);
        res.status(500).send("Fehler beim Erstellen der Daten");
    }
};

// Bestehenden DC-Voltage-Datensatz aktualisieren
exports.updateDcVoltageCurve = async (req, res) => {
    try {
        const { id } = req.params;
        const { typecode, name, actual_value } = req.body;

        const query = `
            UPDATE drives.dc_voltage_curve
            SET typecode = $1, name = $2, actual_value = $3
            WHERE id = $4
            RETURNING *;
        `;

        const values = [typecode, name, actual_value, id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der DC-Voltage-Daten:", error);
        res.status(500).send("Fehler beim Aktualisieren der Daten");
    }
};

// DC-Voltage-Datensatz löschen
exports.deleteDcVoltageCurve = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await client.query("DELETE FROM drives.dc_voltage_curve WHERE id = $1 RETURNING *;", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.send("Daten erfolgreich gelöscht");
    } catch (error) {
        console.error("Fehler beim Löschen der DC-Voltage-Daten:", error);
        res.status(500).send("Fehler beim Löschen der Daten");
    }
};
