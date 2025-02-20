const client = require("../config/db");

// 🔹 Alle Global Data abrufen inkl. Powerstage-Name
exports.getAllGlobalData = async (req, res) => {
    try {
        const query = `
            SELECT
                g.TypeCode,
                p.Name AS Powerstage_Name,
                g.Num_Axes,
                g.VDC_Max,
                g.VDC_Center_Tol,
                g.Pst_Features,
                g.c
            FROM drives.global_data g
                     LEFT JOIN drives.powerstage p
                               ON g.TypeCode = p.TypeCode
        `;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Global Data:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// 🔹 Eine bestimmte Global Data abrufen
exports.getGlobalDataByTypeCode = async (req, res) => {
    try {
        const { typecode } = req.params;
        const query = `
            SELECT 
                g.TypeCode, 
                p.Name AS Powerstage_Name, 
                g.Num_Axes, 
                g.VDC_Max,
                g.VDC_Center_Tol,
                g.Pst_Features,
                g.c
            FROM drives.global_data g
            LEFT JOIN drives.powerstage p 
            ON g.TypeCode = p.TypeCode
            WHERE g.TypeCode = $1
        `;
        const result = await client.query(query, [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kein Eintrag gefunden" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        res.status(500).send("Fehler beim Abrufen der Daten");
    }
};

// 🔹 Einen neuen Global Data Eintrag hinzufügen
exports.createGlobalData = async (req, res) => {
    try {
        const { TypeCode, Num_Axes, VDC_Max, VDC_Center_Tol, Pst_Features, c } = req.body;
        const query = `
            INSERT INTO drives.global_data (TypeCode, Num_Axes, VDC_Max, VDC_Center_Tol, Pst_Features, c)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await client.query(query, [TypeCode, Num_Axes, VDC_Max, VDC_Center_Tol, Pst_Features, c]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Daten:", error);
        res.status(500).send("Fehler beim Hinzufügen der Daten");
    }
};

// 🔹 Einen bestehenden Eintrag aktualisieren
exports.updateGlobalData = async (req, res) => {
    try {
        const { typecode } = req.params;
        const { Num_Axes, VDC_Max, VDC_Center_Tol, Pst_Features, c} = req.body;

        const query = `
            UPDATE drives.global_data
            SET Num_Axes = $1, VDC_Max = $2, VDC_Center_Tol = $3, Pst_Features = $4, c = $5
            WHERE TypeCode = $6 RETURNING *
        `;

        const result = await client.query(query, [Num_Axes, VDC_Max, VDC_Center_Tol, Pst_Features, c, typecode]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kein Eintrag gefunden" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Daten:", error);
        res.status(500).send("Fehler beim Aktualisieren der Daten");
    }
};

// 🔹 Einen Eintrag löschen
exports.deleteGlobalData = async (req, res) => {
    try {
        const { typecode } = req.params;
        const query = `DELETE FROM drives.global_data WHERE TypeCode = $1 RETURNING *`;

        const result = await client.query(query, [typecode]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kein Eintrag gefunden" });
        }

        res.json({ message: "Eintrag erfolgreich gelöscht" });
    } catch (error) {
        console.error("Fehler beim Löschen der Daten:", error);
        res.status(500).send("Fehler beim Löschen der Daten");
    }
};
