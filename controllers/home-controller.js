const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const Event = require("../models/event-model");
const Testimonial = require("../models/testimonial-model");
const courseController = require("../controllers/course-controller");
const trainerController = require("../controllers/trainer-controller");

exports.getHome = async (req, res, next) => {
  try {
    const courseCount = await Course.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const eventCount = await Event.countDocuments();
    const studentCount = 1232;
    const homeCourses = await courseController.getTopCoursesByLikes(3);
    const homeTrainers = await trainerController.getTopTrainersById(3);

    res.render("index", {
      pageTitle: "Home",
      pageClass: "index-page",
      aboutImage: "about.jpg",
      students: studentCount,
      courses: courseCount,
      events: eventCount,
      trainers: trainerCount,
      homeCourses: homeCourses,
      homeTrainers: homeTrainers,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAbout = async (req, res, next) => {
  try {
    const courseCount = await Course.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const eventCount = await Event.countDocuments();
    const studentCount = 1232;

    const testimonials = await Testimonial.find();

    res.render("about", {
      pageTitle: "About",
      pageClass: "about-page",
      aboutImage: "about-2.jpg",
      students: studentCount,
      courses: courseCount,
      events: eventCount,
      trainers: trainerCount,
      testimonials: testimonials,
    });
  } catch (err) {
    next(err);
  }
};
