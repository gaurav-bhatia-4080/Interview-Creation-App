const express = require('express');

const router = express.Router();

console.log("Router has been Loaded");
const homeController = require('../controller/home_controller');

// Router for Home Page
router.get('/', homeController.home );

// Routers for creatign and deleting a task
router.post('/create-list',homeController.createList);
// router.get('/', function(req, res) {
//     res.render('/', { message: req.flash('success','Interview Scheduled Successfully') });
//   });
  
router.post('/delete-task',homeController.DeleteList);
router.post('/edit-list',homeController.EditList);
router.get('/show/:id',homeController.Showlist);
// the base url runs many params hence to shift away from the base urls multiple params, I changed inteview details link to /show/:id



module.exports = router;