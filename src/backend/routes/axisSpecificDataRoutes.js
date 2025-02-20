const express = require("express");
const router = express.Router();
const axisSpecificDataController = require("../controllers/axisSpecificDataController");

// Alle Datensätze abrufen
router.get("/", axisSpecificDataController.getAllAxisSpecificData);

// Einzelnen Datensatz abrufen
router.get("/:typecode", axisSpecificDataController.getAxisSpecificDataByTypeCode);

// Neuen Datensatz hinzufügen
router.post("/", axisSpecificDataController.createAxisSpecificData);

// Bestehenden Datensatz aktualisieren
router.put("/:typecode", axisSpecificDataController.updateAxisSpecificData);

// Datensatz löschen
router.delete("/:typecode", axisSpecificDataController.deleteAxisSpecificData);

module.exports = router;
