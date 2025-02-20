const client = require("../config/db");

// Alle Powerstage-Einträge abrufen
exports.getAllPowerstages = async (req, res) => {
    try {
        const query = "SELECT * FROM drives.powerstage";
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Powerstages:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// Einzelnen Powerstage abrufen
exports.getPowerstageByTypeCode = async (req, res) => {
    try {
        const { typecode } = req.params;
        const query = "SELECT * FROM drives.powerstage WHERE TypeCode = $1";
        const result = await client.query(query, [typecode]);
        if (result.rows.length === 0) {
            return res.status(404).send("Kein Eintrag gefunden");
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).send("Fehler beim Abrufen des Eintrags");
    }
};

// Powerstage hinzufügen
exports.createPowerstage = async (req, res) => {
    try {
        const { TypeCode, Name } = req.body;
        const query = "INSERT INTO drives.powerstage (TypeCode, Name) VALUES ($1, $2) RETURNING *";
        const result = await client.query(query, [TypeCode, Name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).send("Fehler beim Erstellen des Eintrags");
    }
};

// Powerstage aktualisieren
exports.updatePowerstage = async (req, res) => {
    try {
        const { typecode } = req.params;
        const { Name } = req.body;
        const query = "UPDATE drives.powerstage SET Name = $1 WHERE TypeCode = $2 RETURNING *";
        const result = await client.query(query, [Name, typecode]);
        if (result.rows.length === 0) {
            return res.status(404).send("Kein Eintrag gefunden");
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).send("Fehler beim Aktualisieren des Eintrags");
    }
};

// Powerstage löschen
exports.deletePowerstage = async (req, res) => {
    try {
        const {typecode} = req.params;
        const query = "DELETE FROM drives.powerstage WHERE TypeCode = $1 RETURNING *";
        const result = await client.query(query, [typecode]);
        if (result.rows.length === 0) {
            return res.status(404).send("Kein Eintrag gefunden");
        }
        res.json({message: "Eintrag erfolgreich gelöscht"});
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).send("Fehler beim Löschen des Eintrags");
    }
}
