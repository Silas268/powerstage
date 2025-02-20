const express = require("express");
const router = express.Router();
const servoSoftDataController = require("../controllers/servoSoftDataController");

// Alle Produktdaten abrufen
router.get("/", servoSoftDataController.getAllProductData);

// Einzelne Produktdaten abrufen
router.get("/:typecode", servoSoftDataController.getProductDataByTypeCode);

// Neuen Datensatz erstellen
router.post("/", servoSoftDataController.createProductData);

// Produktdaten aktualisieren
router.put("/:typecode", servoSoftDataController.updateProductData);

// Produktdaten löschen
router.delete("/:typecode", servoSoftDataController.deleteProductData);

module.exports = router;
