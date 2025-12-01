const Contact = require("../models/contact-model");

exports.getContact = (req, res, next) => {
  res.render("contact", {
    pageTitle: "Contact Us",
    pageClass: "contact-page",
  });
};

exports.getThanks = (req, res, next) => {
  res.render("thanks", {
    pageTitle: "Contact Us",
    pageClass: "contact-page",
  });
};

exports.postContact = async (req, res, next) => {
  try {
    const response = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      postDate: new Date(),
    });
    res.redirect("/contacts/thanks");
  } catch (err) {
    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
      errorMessage: "An error occurred, please try again.",
      formData: req.body,
    });
  }
};
