const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return v.length >= 1 && v.length <= 50;
      },
      message: "Name must be between 1 and 50 characters"
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Email must be a valid email address"
    }
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  postDate: {
    type: Date,
    required: true
  },
  response: {
    type: String,
    default: null
  },
  responseDate: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Contact", contactSchema);
