const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);
router.post("/logout", userController.postLogout);

module.exports = router;

