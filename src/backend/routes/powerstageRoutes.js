const express = require("express");
const router = express.Router();
const powerstageController = require("../controllers/powerstageController");

router.get("/", powerstageController.getAllPowerstages);
router.get("/:typecode", powerstageController.getPowerstageByTypeCode);
router.post("/", powerstageController.createPowerstage);
router.put("/:typecode", powerstageController.updatePowerstage);
router.delete("/:typecode", powerstageController.deletePowerstage);

module.exports = router;
