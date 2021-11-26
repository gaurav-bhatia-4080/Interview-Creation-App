const mongoose = require('mongoose');

// Designing Schema for Database
const interviewerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  mailId: String
})

// Exporting Schema
const Interviewer = mongoose.model('Interviewer', interviewerSchema);

module.exports = Interviewer;