const Trainer = require("../models/trainer-model");

exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();
    res.render("trainers", {
      pageTitle: "Trainers",
      pageClass: "trainers-page",
      trainers,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTopTrainersById = async (limit) => {
  try {
    const trainers = await Trainer.find().sort({ _id: 1 }).limit(limit);
    return trainers;
  } catch (err) {
    console.log(err);
    return [];
  }
};
