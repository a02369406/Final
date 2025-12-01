const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api-controller");

router.get("/token", apiController.getToken);
router.get("/courses", apiController.verifyToken, apiController.getCourses);

module.exports = router;

