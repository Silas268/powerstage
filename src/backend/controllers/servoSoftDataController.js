const client = require("../config/db");

// Alle Einträge abrufen
exports.getAllProductData = async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM drives.servo_soft");
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Einzelne Produktdaten anhand des Typecodes abrufen
exports.getProductDataByTypeCode = async (req, res) => {
    try {
        const { typecode } = req.params;
        const result = await client.query("SELECT * FROM drives.servo_soft WHERE typecode = $1", [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Neuen Datensatz erstellen
exports.createProductData = async (req, res) => {
    try {
        const { typecode, model, exclude, product_source_type, legacy_type, display_type, image_id, combined_product_type, max_capacity, bus_typ, eff_inv } = req.body;

        const query = `
            INSERT INTO drives.servo_soft (typecode, model, exclude, product_source_type, legacy_type, display_type, image_id, combined_product_type, max_capacity, bus_typ, eff_inv) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;

        const values = [typecode, model, exclude, product_source_type, legacy_type, display_type, image_id, combined_product_type, max_capacity, bus_typ, eff_inv];
        const result = await client.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Erstellen der Daten:", error);
        res.status(500).send("Fehler beim Erstellen der Daten");
    }
};

// Datensatz aktualisieren
exports.updateProductData = async (req, res) => {
    try {
        const { typecode } = req.params;
        const { model, exclude, product_source_type, legacy_type, display_type, image_id, combined_product_type, max_capacity, bus_typ, eff_inv } = req.body;

        const query = `
            UPDATE drives.servo_soft
            SET model = $1, exclude = $2, product_source_type = $3, legacy_type = $4, display_type = $5, image_id = $6, combined_product_type = $7, max_capacity = $8, bus_typ = $9, eff_inv = $10
            WHERE typecode = $11
            RETURNING *;
        `;

        const values = [model, exclude, product_source_type, legacy_type, display_type, image_id, combined_product_type, max_capacity, bus_typ, eff_inv, typecode];
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
exports.deleteProductData = async (req, res) => {
    try {
        const { typecode } = req.params;

        const result = await client.query("DELETE FROM drives.servo_soft WHERE typecode = $1 RETURNING *;", [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).send("Daten nicht gefunden");
        }

        res.send("Daten erfolgreich gelöscht");
    } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        res.status(500).send("Fehler beim Löschen der Daten");
    }
};
