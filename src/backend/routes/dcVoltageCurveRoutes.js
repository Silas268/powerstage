const express = require("express");
const router = express.Router();
const dcVoltageCurveController = require("../controllers/dcVoltageCurveController");

// API-Endpunkte für DC-Voltage-Curves
router.get("/", dcVoltageCurveController.getAllDcVoltageCurves);
router.get("/:typecode", dcVoltageCurveController.getDcVoltageCurveByTypeCode);
router.post("/", dcVoltageCurveController.createDcVoltageCurve);
router.put("/:id", dcVoltageCurveController.updateDcVoltageCurve);
router.delete("/:id", dcVoltageCurveController.deleteDcVoltageCurve);

module.exports = router;