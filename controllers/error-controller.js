exports.get500 = (err, req, res, next) => {
  console.error("Server Error:", err.message);
  console.error(err.stack);
  res.status(500).render("500", {
    pageTitle: "500 - Server Error",
    pageClass: "error-page",
  });
};

exports.get404 = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "404 - Page Not Found",
    pageClass: "error-page",
  });
};

