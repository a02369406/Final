const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");

router.get("/", courseController.getCourses);
router.get("/:slug/register", courseController.getCourseRegistration);
router.post("/:slug/register", courseController.postCourseRegistration);
router.post("/:slug/unregister", courseController.postCourseUnregister);
router.get("/:slug", courseController.getCourseDetails);

module.exports = router;
