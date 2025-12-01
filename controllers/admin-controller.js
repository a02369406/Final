const path = require("path");
const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const User = require("../models/user-model");
const Contact = require("../models/contact-model");
const multer = require("multer");
const emailService = require("../utils/email-service");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/assets/img"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, "course-" + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

exports.uploadSingle = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        const error = new Error(err.message);
        error.status = 400;
        return next(error);
      }
      return next(err);
    }
    next();
  });
};

exports.getCreateCourse = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();
    res.render("create-course", {
      pageTitle: "Create Course",
      pageClass: "create-course-page",
      trainers,
      errorMessage: null,
      formData: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.postCreateCourse = async (req, res, next) => {
  try {
    const { title, summary, description, price, capacity, schedule, trainer } = req.body;

    if (!req.file) {
      try {
        const trainers = await Trainer.find();
        return res.render("create-course", {
          pageTitle: "Create Course",
          pageClass: "create-course-page",
          trainers,
          errorMessage: "Please upload an image file",
          formData: req.body,
        });
      } catch (err) {
        return next(err);
      }
    }

    const imageFileName = req.file.filename;

    const course = new Course({
      title: title,
      summary: summary,
      description: description,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      schedule: schedule,
      trainer: trainer,
      image: imageFileName,
      registrants: [],
      likes: 0,
    });

    await course.save();
    res.redirect("/courses");
  } catch (err) {
    try {
      const trainers = await Trainer.find();
      res.render("create-course", {
        pageTitle: "Create Course",
        pageClass: "create-course-page",
        trainers,
        errorMessage: "An error occurred while creating the course. Please try again.",
        formData: req.body,
      });
    } catch (renderErr) {
      next(renderErr);
    }
  }
};

exports.getEditCourse = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug: slug }).populate("trainer");
    const trainers = await Trainer.find();

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    res.render("edit-course", {
      pageTitle: "Edit Course",
      pageClass: "edit-course-page",
      course,
      trainers,
      errorMessage: null,
      formData: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditCourse = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug: slug });
    const trainers = await Trainer.find();

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    const { title, summary, description, price, capacity, schedule, trainer } = req.body;

    course.title = title;
    course.summary = summary;
    course.description = description;
    course.price = parseFloat(price);
    course.capacity = parseInt(capacity);
    course.schedule = schedule;
    course.trainer = trainer;

    if (req.file) {
      course.image = req.file.filename;
    }

    await course.save();
    res.redirect("/courses/" + course.slug);
  } catch (err) {
    try {
      const course = await Course.findOne({ slug: slug }).populate("trainer");
      const trainers = await Trainer.find();
      res.render("edit-course", {
        pageTitle: "Edit Course",
        pageClass: "edit-course-page",
        course,
        trainers,
        errorMessage: "An error occurred while updating the course. Please try again.",
        formData: req.body,
      });
    } catch (renderErr) {
      next(renderErr);
    }
  }
};

exports.postDeleteCourse = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug: slug });

    if (!course) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    await User.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } }
    );

    await Course.findByIdAndDelete(course._id);
    res.redirect("/courses");
  } catch (err) {
    next(err);
  }
};

exports.getContactList = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ response: null }).sort({ postDate: -1 });

    res.render("contact-list", {
      pageTitle: "Contact Requests",
      pageClass: "contact-list-page",
      contacts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getContactResponse = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    res.render("contact-response", {
      pageTitle: "Respond to Contact",
      pageClass: "contact-response-page",
      contact,
      errorMessage: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.postContactResponse = async (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
    }

    contact.response = response;
    contact.responseDate = new Date();

    await contact.save();

    await emailService.sendContactResponseEmail(
      contact.name,
      contact.email,
      contact.subject,
      response
    );

    res.redirect("/admin/contacts");
  } catch (err) {
    try {
      const contact = await Contact.findById(id);
      if (contact) {
        res.render("contact-response", {
          pageTitle: "Respond to Contact",
          pageClass: "contact-response-page",
          contact,
          errorMessage: "An error occurred while saving the response. Please try again.",
        });
      } else {
        next(err);
      }
    } catch (renderErr) {
      next(renderErr);
    }
  }
};

