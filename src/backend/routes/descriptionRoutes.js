const express = require("express");
const router = express.Router();
const descriptionController = require("../controllers/descriptionController");

router.get("/", descriptionController.getAllDescriptions);
router.get("/:key", descriptionController.getDescriptionByKey);
router.post("/", descriptionController.createDescription);
router.put("/:key", descriptionController.updateDescription);
router.delete("/:key", descriptionController.deleteDescription);

module.exports = router;