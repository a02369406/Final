// Import sequelized db
const sequelize = require("./database");

// Import models
const Trainer = require("../models/trainer-model");
const Event = require("../models/event-model");
const Course = require("../models/course-model");
const Contact = require("../models/contact-model");
const Testimonial = require("../models/testimonial-model");
const User = require("../models/user-model");

// Import Data
const trainerData = require("./trainers.json");
const eventData = require("./events.json");
const courseData = require("./courses.json");
const testimonialData = require("./testimonials.json");
const userData = require("./users.json");
const contactData = require("./contacts.json");

// Define associations
Course.belongsTo(Trainer, { foreignKey: "trainer", as: "trainerId" });
Trainer.hasMany(Course, { foreignKey: "trainer" });

// Sync sequelize instance with the database
sequelize
  // .sync()
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully!\nCreating trainers...");
    return Trainer.bulkCreate(trainerData);
  })
  .then(() => {
    console.log("Trainers created successfully!\nCreating events...");
    return Event.bulkCreate(eventData);
  })
  .then(() => {
    console.log("Events created successfully!\nCreating courses...");
    return Course.bulkCreate(courseData);
  })
  .then(() => {
    console.log("Courses created successfully!\nCreating testimonials...");
    return Testimonial.bulkCreate(testimonialData);
  })
  .then(() => {
    console.log("Testimonials created successfully!\nCreating users...");
    return User.bulkCreate(userData);
  })
  .then(() => {
    console.log("Users created successfully!\nCreating contacts...");
    return Contact.bulkCreate(contactData);
  })
  .then(() => {
    console.log(
      "All data initialized successfully!\nDatabase initialization complete."
    );
  })
  .catch((err) => {
    console.error("Error during database initialization:", err);
  });
