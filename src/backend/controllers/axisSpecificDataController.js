const client = require("../config/db");

// Alle axis_specific_data abrufen
exports.getAllAxisSpecificData = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM drives.axis_specific_data");
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Einzelne axis_specific_data abrufen
exports.getAxisSpecificDataByTypeCode = async (req, res) => {
    try {
        const { typecode } = req.params;
        const result = await client.query("SELECT * FROM drives.axis_specific_data WHERE typecode = $1", [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Neuen Datensatz hinzufügen
exports.createAxisSpecificData = async (req, res) => {
    try {
        const { typecode, ino_maxis, curr_scale, interlock_time, module_tempmax, is_comp_thresh, is_compfreq, is_sampling, cut_off_freq_dc } = req.body;

        const query = `
            INSERT INTO drives.axis_specific_data (typecode, i_nom_axis, curr_scale, interlock_time, module_temp_max, is_comp_thresh, is_comp_freq, is_sampling, cut_off_freq_dc) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [typecode, i_nom_axis, curr_scale, interlock_time, module_temp_max, is_comp_thresh, is_comp_freq, is_sampling, cut_off_freq_dc];
        const result = await client.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Erstellen der Daten:", error);
        res.status(500).send("Fehler beim Erstellen der Daten");
    }
};

// Bestehenden Datensatz aktualisieren
exports.updateAxisSpecificData = async (req, res) => {
    try {
        const { typecode } = req.params;
        const { i_nom_axis, curr_scale, interlock_time, module_temp_max, is_comp_thresh, is_comp_freq, is_sampling, cut_off_freq_dc } = req.body;

        const query = `
            UPDATE drives.axis_specific_data
            SET i_nom_axis = $1, curr_scale = $2, interlock_time = $3, module_temp_max = $4, is_comp_thresh = $5, is_compfreq = $6, is_sampling = $7, cut_off_freq_dc = $8
            WHERE typecode = $9
            RETURNING *;
        `;

        const values = [i_nom_axis, curr_scale, interlock_time, module_temp_max, is_comp_thresh, is_comp_freq, is_sampling, cut_off_freq_dc, typecode];
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
exports.deleteAxisSpecificData = async (req, res) => {
    try {
        const { typecode } = req.params;

        const result = await client.query("DELETE FROM drives.axis_specific_data WHERE typecode = $1 RETURNING *;", [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.send("Daten erfolgreich gelöscht");
    } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        res.status(500).send("Fehler beim Löschen der Daten");
    }
};
