// Created by Mathew Lee, 2017 TM for J7tees LLC
// If cloning from github, start project by:
// 1) npm install
// 2) If using db, create a config folder and file in above directory for user
// abstraction.
// Notes page can be found on google drive
// 3) To deploy to Heroku:
// heroku git:remote -a project
// git push heroku master

// Import Express and initialize app object
var express = require('express');
var app = express();

//Import path for file system navigation
var path = require('path');

// Import security measures
var compression = require('compression');
var helmet = require('helmet');
var expressValidator = require('express-validator');
var RateLimit = require('express-rate-limit');

// Import Body Parser which allows form input and form handling
var bodyParser = require('body-parser');

// Import mail application for email handling
var nodemailer = require("nodemailer");


//**************Enable middlewares***********************************
app.enable('trust proxy'); //Allows Heroku to be used as it is a proxy

var limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes 
  max: 500, // limit each IP to 500 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

app.use(helmet());
app.use(compression());
app.set("view engine", 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')))

//***********Start listening on Port**************
var count = 0;
var port = process.env.PORT || 3000; //Allows dynamic port assignment, OR on port 3000
app.listen(port);


//***********ROUTES***********************************
var routes = require('./routes');

app.get('/', routes.home);

app.get('/About', routes.about);

// app.get('/Gallery', routes.gallery);

app.get('/contactForm', routes.contactForm);

app.get('/Contact', routes.contact);

app.get('/Pricing', routes.pricing);

app.get('/Search', routes.Search);

app.get('/faq', routes.faq);

app.get('/guide', routes.guide);

app.post('/SearchFormProcessor', function (req, res) {
  var option = req.body.option;
  var Query = req.body.Query;
  var item = {};
  item[option] = Query;

  SearchModReq.SearchFormMod.find(item, function (err, result) {
    // console.log(result);
    res.render('searchResults', {
      QueryResults: result
    });

  });

});

app.post('/FormProcessor', function (req, res) {

  // SANITIZE AND VERIFY INPUT
  req.checkBody('FirstName', 'Invalid First Name Entry').isAlpha()
    .notEmpty().withMessage('Please Enter a First Name'); //Verify that input is correct
  req.sanitize('FirstName').escape(); //escapes out of html tags
  req.sanitize('FirstName').trim(); //Removes excess whitespace
  //Input is now sanitized, original req.body.var is overwritten

  req.checkBody('LastName', 'Invalid Last Name Entry')
    .isAlpha()
    .notEmpty().withMessage('Please Enter a Last Name');
  req.sanitize('LastName').escape();
  req.sanitize('LastName').trim();

  req.checkBody('Email', 'Invalid Email').notEmpty();
  req.sanitize('Email').escape();
  req.sanitize('Email').trim();

  req.checkBody('Company', 'Invalid Company Entry').notEmpty();
  req.sanitize('Company').escape();
  req.sanitize('Company').trim();

  req.checkBody('Message', 'Invalid Message Entry').notEmpty();
  req.sanitize('Message').escape();
  req.sanitize('Message').trim();

  var errors = req.validationErrors(); //Returns object with {param: 'Name', msg: 'YOUR MESSAGE def earlier', value}

  var SaniParams = {
    UserFirstName: req.body.FirstName,
    UserLastName: req.body.LastName,
    UserEmail: req.body.Email,
    UserCompany: req.body.Company,
    UserMessage: req.body.Message
  };

  if (errors) { //Returns false and moves to else if good input
    res.render('contactErrors.ejs', {
      errors: errors
    });
    // res.render('contactForm.ejs', {name: req.body.name, errors: errors}); //Can pass parameters in form of object back to render for use in html page. Entire object can be passed, or individual params.
    return; //Not sure why return here.
  } else {

    // SEND THE EMAIL
    var mailOpts, smtpTrans;

    smtpTrans = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "j7tees@gmail.com",
        pass: j7teesPassword
      }
    });

    mailOpts = {
      from: req.body.Email,
      to: 'j7tees@gmail.com',
      subject: 'Customer Inquiry from: ' + req.body.FirstName + ' ' + req.body.LastName,
      text: "Email: " + req.body.Email + "\n" + "Company: " + req.body.Company + "\n" + "\n" + req.body.Message
    };

    smtpTrans.sendMail(mailOpts)

    //*************Enters form info into DB as well***************************
    var item = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Company: req.body.Company,
      Message: req.body.Message
    }
    // ###Enable the two lines below to activate DB logging###
    // var formcollection = new SearchModReq.SearchFormMod(item);
    // formcollection.save();

    // FormModel.ContactFormMod.find({"FirstName":"Mathew"},function(err,docs) {
    //   res.send(docs);
    // });
    res.send("<h1>Form Submitted!</h1><br><a href='/'>Return To The Home Page</a>");

  };
});

// ###########################################################################################################################
app.get('/feedbackForm', routes.feedbackForm);

app.post('/feedbackFormProcessor', function (req, res) {

  // SANITIZE AND VERIFY INPUT
  req.checkBody('FirstName', 'Invalid First Name Entry').isAlpha()
    .notEmpty().withMessage('Please Enter a First Name'); //Verify that input is correct
  req.sanitize('FirstName').escape(); //escapes out of html tags
  req.sanitize('FirstName').trim(); //Removes excess whitespace
  //Input is now sanitized, original req.body.var is overwritten

  req.checkBody('LastName', 'Invalid Last Name Entry')
    .isAlpha()
    .notEmpty().withMessage('Please Enter a Last Name');
  req.sanitize('LastName').escape();
  req.sanitize('LastName').trim();

  req.checkBody('Email', 'Invalid Email').notEmpty();
  req.sanitize('Email').escape();
  req.sanitize('Email').trim();

  req.checkBody('Company', 'Invalid Company Entry').notEmpty();
  req.sanitize('Company').escape();
  req.sanitize('Company').trim();

  req.checkBody('Message', 'Invalid Message Entry').notEmpty();
  req.sanitize('Message').escape();
  req.sanitize('Message').trim();

  var errors = req.validationErrors(); //Returns object with {param: 'Name', msg: 'YOUR MESSAGE def earlier', value}

  var SaniParams = {
    UserFirstName: req.body.FirstName,
    UserLastName: req.body.LastName,
    UserEmail: req.body.Email,
    UserCompany: req.body.Company,
    UserMessage: req.body.Message
  };

  if (errors) { //Returns false and moves to else if good input
    res.render('contactErrors.ejs', {
      errors: errors
    });
    // res.render('contactForm.ejs', {name: req.body.name, errors: errors}); //Can pass parameters in form of object back to render for use in html page. Entire object can be passed, or individual params.
    return; //Not sure why return here.
  } else {

    // SEND THE EMAIL
    var mailOpts, smtpTrans;

    smtpTrans = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "j7tees@gmail.com",
        pass: j7teesPassword
      }
    });

    mailOpts = {
      from: req.body.Email,
      to: 'j7tees@gmail.com',
      subject: 'Customer Inquiry from: ' + req.body.FirstName + ' ' + req.body.LastName,
      text: "Email: " + req.body.Email + "\n" + "Company: " + req.body.Company + "\n" + "\n" + req.body.Message
    };

    smtpTrans.sendMail(mailOpts)

    //*************Enters form info into DB as well***************************
    var item = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Company: req.body.Company,
      Message: req.body.Message
    }
    // ###Enable the two lines below to activate DB logging###
    // var formcollection = new SearchModReq.SearchFormMod(item);
    // formcollection.save();

    // FormModel.ContactFormMod.find({"FirstName":"Mathew"},function(err,docs) {
    //   res.send(docs);
    // });
    res.send("<h1>Form Submitted!</h1><br><a href='/'>Return To The Home Page</a>");

  };
});

app.get('*', routes.notFound); //MUST REMAIN AT END OF CODE, otherwise all routes 404