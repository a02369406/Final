// Load environment variables
require("dotenv").config();

// Import libraries
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

// Import Middleware
const requestLogger = require("./middleware");

// Import Models
const Course = require("./models/course-model");
const Trainer = require("./models/trainer-model");

// Import Routes
const homeRoutes = require("./routes/home-routes");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");
const apiRoutes = require("./routes/api-routes");
const externalApiRoutes = require("./routes/external-api-routes");

// Import Error Controller
const errorController = require("./controllers/error-controller");

const app = express();

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Layout settings
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    const SESSION_SECRET = process.env.SESSION_SECRET;
    if (!SESSION_SECRET) {
      console.error("Error: SESSION_SECRET environment variable is not set");
      process.exit(1);
    }

    app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
          mongoUrl: MONGODB_URI,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      })
    );

    app.use((req, res, next) => {
      res.locals.user = req.session.user || null;
      next();
    });

    app.use("/api", apiRoutes);
    app.use("/auth", userRoutes);
    app.use("/admin", adminRoutes);
    app.use("/trainers", trainerRoutes);
    app.use("/events", eventRoutes);
    app.use("/courses", courseRoutes);
    app.use("/contacts", contactRoutes);
    app.use("/", externalApiRoutes);
    app.use("/", homeRoutes);

    app.use(errorController.get500);
    app.use(errorController.get404);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
