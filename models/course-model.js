const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema({
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
  summary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  registrants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  schedule: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: true
  },
  slug: {
    type: String,
    required: true
  }
});

courseSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, trim: true });
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
