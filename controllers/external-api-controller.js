const axios = require("axios");

exports.getExternalApi = async (req, res, next) => {
  try {
    const count = req.query.count || 1;
    const apiUrl = `https://randomuser.me/api/?results=${count}`;

    const response = await axios.get(apiUrl);
    const users = response.data.results;

    res.render("external-api", {
      pageTitle: "Random User API",
      pageClass: "external-api-page",
      users: users,
      count: count,
    });
  } catch (error) {
    res.render("external-api", {
      pageTitle: "Random User API",
      pageClass: "external-api-page",
      users: [],
      count: 1,
      error: "Failed to fetch data from the API. Please try again.",
    });
  }
};

