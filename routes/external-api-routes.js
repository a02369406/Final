const express = require("express");
const router = express.Router();
const externalApiController = require("../controllers/external-api-controller");

router.get("/externalapi", externalApiController.getExternalApi);

module.exports = router;

