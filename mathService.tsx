// This is the file we want to test
const db = require('./db'); // Our pretend database

// A simple function that gets a number from the database and adds to it
function addToNumberFromDb(value) {
  const dbNumber = db.getNumber(); // Get number from database
  return value + dbNumber; // Add them together
}

module.exports = { addToNumberFromDb }; // Make it available for testing

// db.js
// Our pretend database file
function getNumber() {
  return 10; // In real life, this would talk to a real database
}

module.exports = { getNumber };
