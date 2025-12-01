const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  testimonial: {
    type: String,
    required: true
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /\.(jpg|jpeg|png)$/i.test(v);
      },
      message: "Image must be a .jpg, .jpeg, or .png file"
    }
  }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
