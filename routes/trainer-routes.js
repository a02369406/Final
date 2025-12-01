const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainer-controller");

router.get("/", trainerController.getTrainers);

module.exports = router;
