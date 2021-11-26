const mongoose=require('mongoose');

// Designing Schema for Database
const listSchema=new mongoose.Schema({
  startDate: { type: Date, default: Date.now },
  startTime: String,
  endTime: String,
  description: String,
  name_interviewer: String,
  name_student:String,
  mailid_interviewer: String,
  mail_id_student:String
})

// Exporting Schema
const Item = mongoose.model('Item', listSchema);

module.exports = Item;