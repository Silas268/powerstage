const express = require("express");
const router = express.Router();
const globalDataController = require("../controllers/globalDataController");

router.get("/", globalDataController.getAllGlobalData);
router.get("/:typecode", globalDataController.getGlobalDataByTypeCode);
router.post("/", globalDataController.createGlobalData);
router.put("/:typecode", globalDataController.updateGlobalData);
router.delete("/:typecode", globalDataController.deleteGlobalData);

module.exports = router;
