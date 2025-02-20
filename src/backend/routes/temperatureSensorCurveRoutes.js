const express = require("express");
const router = express.Router();
const temperatureSensorCurveController = require("../controllers/temperatureSensorCurveController");

router.get("/", temperatureSensorCurveController.getAllTemperatureSensorCurves);
router.get("/:typecode", temperatureSensorCurveController.getTemperatureSensorCurveByTypeCode);
router.post("/", temperatureSensorCurveController.createTemperatureSensorCurve);
router.put("/:id", temperatureSensorCurveController.updateTemperatureSensorCurve);
router.delete("/:id", temperatureSensorCurveController.deleteTemperatureSensorCurve);

module.exports = router;
