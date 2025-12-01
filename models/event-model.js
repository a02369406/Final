const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return v.length >= 1 && v.length <= 50;
      },
      message: "Title must be between 1 and 50 characters"
    }
  },
  summary: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 350,
    validate: {
      validator: function(v) {
        return v.length >= 1 && v.length <= 350;
      },
      message: "Summary must be between 1 and 350 characters"
    }
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png)$/i.test(v);
      },
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Event", eventSchema);
