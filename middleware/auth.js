exports.isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (!req.session.user.roles || !req.session.user.roles.includes("admin")) {
    return res.redirect("/auth/login");
  }

  next();
};

