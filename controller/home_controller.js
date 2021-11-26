const Item = require("../models/newitem");
const Student = require("../models/student");
const Interviwer = require("../models/interviewer");
const taskMailer = require("../mailers/sendmail");
const { request } = require("express");

function toDate(dStr) { 
	var now = new Date();
  if(dStr[0] == '0') dStr[0] = '';
  now.setHours(dStr.substr(0, dStr.indexOf(":")));
  now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
  now.setSeconds(0);
 	return now;
}

function validityCheck(list, request) {
  var flag = true;
  for (let i in list) {
    var d = new Date(request.body.startDate);
    if( list[i].mailid_interviewer== request.body.mailid_interviewer || list[i].mailid_student== request.body.mailid_student || list[i].mailid_interviewer== request.body.mailid_student || list[i].mailid_student== request.body.mailid_interviewer){
      if(list[i].startDate.getDate() == d.getDate()){
        var startTime = toDate(request.body.startTime);
        var endTime = toDate(request.body.endTime);
        var currStartTime = toDate(list[i].startTime);
        var currEndTime = toDate(list[i].endTime);
        if(
          (startTime.getTime() >= currStartTime.getTime() && startTime.getTime() <= currEndTime.getTime())
          || (endTime.getTime() >= currStartTime.getTime() && endTime.getTime() <= currEndTime.getTime())
          ) {
          flag = false;
        }              
      }            
    }
  }
  return flag;
}

module.exports.home = function (req, res) {
  let students;
  Student.find({}, function(err, result1) {
    if (err) {
      throw err;
    }
    students = result1;
  });
  let interviewers;
  Interviwer.find({}, function(err, result2) {
    if (err) {
      throw err;
    }
    interviewers = result2;
  });

  Item.find({}, function (err, toDoList) {
    if (err) { 
    console.log('List Cannot be Printed'); 
    return;     
  }
    return res.render('home', {
      list: toDoList,
      message : req.flash('message'),
      all_students: students,
      all_interviewers: interviewers,
    });
  }
  )
}

// Controller for Creating Task
module.exports.createList = function (req, res) {
  try{
    Item.find({}, async function (err, toDoList) {
      if (err) { 
        console.log('List Cannot be Printed'); 
          return;     
      }

      var check = validityCheck(toDoList, req);

      if (check == false) {
        req.flash('error', 'Interview Cannot be Scheduled, participant unavailable');
        return res.redirect('back');
      }
      else {
        const response = await Item.create({
          startDate: req.body.startDate,
          startTime: req.body.startTime,
          endTime : req.body.endTime,
          description: req.body.description,
          name_interviewer: req.body.name_interviewer,
          name_student: req.body.name_student,
          mailid_interviewer: req.body.mailid_interviewer,
          mailid_student: req.body.mailid_student,
        });
        console.log("response of creation", response);
        taskMailer.newTask(req.body,response._id); 
        req.flash('success', 'Interview Schedule Successfully');
        return res.redirect('back');
      }
    });

  }
  catch(err){
      console.log('Error',err);
      req.flash('error', 'Interview Cannot be Scheduled, some issue');
      return;
  }    
}

// Controller for Deleting Task
module.exports.DeleteList = function (req, res) {
  console.log(req.body);
  for(let i in req.body){
      console.log(i);
      if (i.startsWith('check'))
      {
        Item.findByIdAndDelete(req.body[i], function (err) {
          if (err) {
            console.log('Error in Deleting the item'); 
            req.flash('error', 'Interview Cannot be cancelled');
            return;
          }    
        })
      }
  }
  req.flash('warning', 'Interview Cancelled Successfully');
  return res.redirect('back');
}

// Controller to edit things
module.exports.EditList = function (req, res) {
  try{
    Item.find({}, async function (err, toDoList) {
      if (err) { 
        console.log('List Cannot be Printed'); 
        return;     
      }
      
      var check = validityCheck(toDoList, req);

      if (check == false) {
        req.flash('error', 'Interview Cannot be Rescheduled, participant unavailable');
        return res.redirect('back');
      }
      else {
        Item.findByIdAndUpdate(req.body['edit_id'], {
          startDate: req.body.startDate_c,
          startTime: req.body.startTime_c,
          endTime : req.body.endTime_c,
          description: req.body.description_c
          }, function (err) {
            if (err) {
              console.log('Error in Editing the item'); 
              return;
            }
          })
      
        req.flash('warning', 'Interview Rescheduled Successfully');
        return res.redirect('back');
      }
    });

  }
  catch(err){
      console.log('Error',err);
      req.flash('error', 'Interview Cannot be Rescheduled, some issue');
      return;
  }    
}


module.exports.Showlist= function(req,res){
  Item.find({}, function (err, toDoList) {
    if (err) { 
      console.log('List Cannot be Printed'); 
      return;     
    }

    const id = req.params['id'];
    var document;
    for (let i in toDoList){
      if (toDoList[i]._id == id)
      {
        document = toDoList[i];
      }
    }
    return res.render('specfic_data_page', {
      document: document,
    });
  })      
}