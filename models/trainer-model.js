const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
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
  expertise: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Trainer", trainerSchema);
