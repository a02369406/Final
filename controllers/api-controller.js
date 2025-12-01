const Course = require("../models/course-model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("Error: JWT_SECRET environment variable is not set");
}

exports.getToken = (req, res, next) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }
    const expiresIn = 24 * 60 * 60;
    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + expiresIn }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("trainer").select("-registrants");

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
    const coursesWithImageUrl = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.imageUrl = `${BASE_URL}/img/${courseObj.image}`;
      delete courseObj.image;
      return courseObj;
    });

    res.json(coursesWithImageUrl);
  } catch (err) {
    next(err);
  }
};

