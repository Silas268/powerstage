const express = require("express");
const router = express.Router();
const currentValuesController = require("../controllers/currentValuesController");

// API-Endpunkte für CurrentValues
router.get("/", currentValuesController.getAllCurrentValues);
router.get("/:typecode", currentValuesController.getCurrentValuesByTypecode);
router.post("/", currentValuesController.createCurrentValue);
router.put("/:id", currentValuesController.updateCurrentValue);
router.delete("/:id", currentValuesController.deleteCurrentValue);

module.exports = router;
