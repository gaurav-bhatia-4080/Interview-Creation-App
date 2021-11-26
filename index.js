const express = require("express");
const port = 8003;
const bodyParser=require('body-parser')
const app = express();
const db = require('./config/mongoose');
const Item = require('./models/newitem');
const Student = require('./models/student');
const Interviewer = require('./models/interviewer');
const session = require('express-session');
const flush = require('connect-flash');
const customMware = require('./config/middleware');

//Using Middlewares
app.use(express.urlencoded());
app.use(express.static('./assets'));
// app.use(express.urlencoded());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);
app.use(flush());
app.use(customMware.setFlash);
//Using Express Router
app.use('/', require('./routes'));

//Setting up My View Engine
app.set('view engine', 'ejs');
app.set('views', './views');




// Listening to port
app.listen(port , function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is Running on Port::",port);
});