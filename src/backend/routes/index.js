const express = require("express");
const router = express.Router();

router.use("/powerstage", require("./powerstageRoutes"));
router.use("/globaldata", require("./globalDataRoutes"));
router.use("/axisspecificdata", require("./axisSpecificDataRoutes"));
router.use("/currentvalues", require("./currentValuesRoutes"));
router.use("/dcvoltagecurve", require("./dcVoltageCurveRoutes"));
router.use("/temperaturesensorcurve", require("./temperatureSensorCurveRoutes"));
router.use("/servosoft", require("./servosoftDataRoutes"));
router.use("/descriptions", require("./descriptionRoutes"));

module.exports = router;
