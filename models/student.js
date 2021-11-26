const mongoose = require('mongoose');

// Designing Schema for Database
const studentSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  mailId: String
})

// Exporting Schema
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;