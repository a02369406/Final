const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const { isAdmin } = require("../middleware/auth");

router.get("/courses/create", isAdmin, adminController.getCreateCourse);
router.post("/courses/create", isAdmin, adminController.uploadSingle, adminController.postCreateCourse);
router.get("/courses/:slug/edit", isAdmin, adminController.getEditCourse);
router.post("/courses/:slug/edit", isAdmin, adminController.uploadSingle, adminController.postEditCourse);
router.post("/courses/:slug/delete", isAdmin, adminController.postDeleteCourse);
router.get("/contacts", isAdmin, adminController.getContactList);
router.get("/contacts/:id/respond", isAdmin, adminController.getContactResponse);
router.post("/contacts/:id/respond", isAdmin, adminController.postContactResponse);

module.exports = router;

