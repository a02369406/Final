const User = require("../models/user-model");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res) => {
  res.render("login", {
    pageTitle: "Login",
    pageClass: "login-page",
    errorMessage: null,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    
    if (!user) {
      return res.render("login", {
        pageTitle: "Login",
        pageClass: "login-page",
        errorMessage: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.render("login", {
        pageTitle: "Login",
        pageClass: "login-page",
        errorMessage: "Invalid email or password",
      });
    }

    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles
    };
    res.redirect("/");
  } catch (err) {
    res.render("login", {
      pageTitle: "Login",
      pageClass: "login-page",
      errorMessage: "An error occurred, please try again.",
    });
  }
};

exports.getSignup = (req, res) => {
  res.render("signup", {
    pageTitle: "Sign Up",
    pageClass: "signup-page",
    errorMessage: null,
    formData: null,
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.render("signup", {
        pageTitle: "Sign Up",
        pageClass: "signup-page",
        errorMessage: "Passwords do not match",
        formData: req.body,
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("signup", {
        pageTitle: "Sign Up",
        pageClass: "signup-page",
        errorMessage: "Email already exists",
        formData: req.body,
      });
    }

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      roles: ["user"],
      courses: [],
    });

    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    res.render("signup", {
      pageTitle: "Sign Up",
      pageClass: "signup-page",
      errorMessage: "An error occurred, please try again.",
      formData: req.body,
    });
  }
};

exports.postLogout = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
};

