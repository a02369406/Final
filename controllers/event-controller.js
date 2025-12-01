const Event = require("../models/event-model");

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const formattedEvents = events.map((event) => ({
      ...event.toObject(),
      formattedDate: new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    }));

    res.render("events", {
      pageTitle: "Events",
      pageClass: "events-page",
      events: formattedEvents,
    });
  } catch (err) {
    next(err);
  }
};
