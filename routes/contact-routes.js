const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");

router.get("/new", contactController.getContact);
router.post("/create", contactController.postContact);
router.get("/thanks", contactController.getThanks);

module.exports = router;
