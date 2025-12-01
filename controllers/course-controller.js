const mongoose = require("mongoose");
const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const User = require("../models/user-model");
const emailService = require("../utils/email-service");

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("trainer");
    
    let userCourses = [];
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      if (user) {
        userCourses = user.courses.map(c => c.toString());
      }
    }

    const coursesWithRegistration = courses.map(course => {
      const isRegistered = userCourses.includes(course._id.toString());
      return {
        ...course.toObject(),
        isRegistered
      };
    });

    res.render("courses", {
      pageTitle: "Courses",
      pageClass: "courses-page",
      courses: coursesWithRegistration,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourseDetails = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug: slug }).populate("trainer");
    
    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }
    
    let isRegistered = false;
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      if (user) {
        isRegistered = user.courses.some(c => c.toString() === course._id.toString());
      }
    }

    res.render("course-details", {
      pageTitle: "Course Details",
      pageClass: "course-details-page",
      course: {
        ...course.toObject(),
        isRegistered
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopCoursesByLikes = async (limit) => {
  try {
    const courses = await Course.find().populate("trainer").sort({ likes: -1 }).limit(limit);
    return courses;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getCourseRegistration = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug: slug }).populate("trainer");
    const allCourses = await Course.find().select("_id title");
    
    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    res.render("course-registration", {
      pageTitle: "Course Registration",
      pageClass: "course-registration-page",
      course,
      allCourses,
      user: req.session.user,
    });
  } catch (err) {
    next(err);
  }
};

exports.postCourseRegistration = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  const { slug } = req.params;
  const { courseId } = req.body;
  const userId = req.session.user._id;

  try {
    const course = await Course.findById(courseId).populate("trainer");
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    const isAlreadyRegistered = user.courses.some(c => c.toString() === courseId.toString());

    if (isAlreadyRegistered) {
      return res.render("course-registration-success", {
        pageTitle: "Already Registered",
        pageClass: "course-registration-page",
        message: "You are already registered for this course.",
        course,
      });
    }

    if (course.registrants.length >= course.capacity) {
      return res.status(400).render("404", {
        pageTitle: "Registration Error",
        pageClass: "error-page",
      });
    }

    user.courses.push(new mongoose.Types.ObjectId(courseId));
    course.registrants.push(new mongoose.Types.ObjectId(userId));

    await user.save();
    await course.save();

    const userName = `${user.firstName} ${user.lastName}`;
    await emailService.sendCourseRegistrationEmail(
      userName,
      user.email,
      course.title,
      course.schedule
    );

    res.render("course-registration-success", {
      pageTitle: "Registration Successful",
      pageClass: "course-registration-page",
      message: "You have successfully registered for the course!",
      course,
    });
  } catch (err) {
    next(err);
  }
};

exports.postCourseUnregister = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  const { slug } = req.params;
  const userId = req.session.user._id;

  try {
    const course = await Course.findOne({ slug: slug });
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    const courseId = course._id.toString();
    const isRegistered = user.courses.some(c => c.toString() === courseId);

    if (!isRegistered) {
      return res.status(400).render("404", {
        pageTitle: "Error",
        pageClass: "error-page",
      });
    }

    user.courses = user.courses.filter(c => c.toString() !== courseId);
    course.registrants = course.registrants.filter(r => r.toString() !== userId);

    await user.save();
    await course.save();

    res.redirect("/courses/" + slug);
  } catch (err) {
    next(err);
  }
};
