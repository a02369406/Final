const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Set files/paths
const logDirectory = path.join(__dirname, "log");
const logFile = path.join(logDirectory, "logRequests.txt");

// Create a write stream (in append mode)
const logStream = fs.createWriteStream(logFile, { flags: "a" });

// Setup the logger in dev format
const requestLogger = morgan("dev", { stream: logStream });

module.exports = requestLogger;
