const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "log");
const logFile = path.join(logDirectory, "logRequests.txt");

const logStream = fs.createWriteStream(logFile, { flags: "a" });

const requestLogger = morgan("dev", { stream: logStream });

module.exports = requestLogger;
