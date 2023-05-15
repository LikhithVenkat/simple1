const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
// serve static files from the 'proj' directory
app.use(express.static(path.join(__dirname, 'proj')));


// serve the homepage.html file
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'homepage.html'));
});

// redirect to friends.html on clicking friends img
app.get('/friends', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'friends.html'));
});

// redirect to login.html on clicking login img
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'login.html'));
});

app.get('/homepage', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'homepage.html'));
});

app.get('/confirm', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'confirm.html'));
});

app.get('/menu', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'menu.html'));
});

app.get('/modify_friends_list', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'modify_friends_list.html'));
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'register.html'));
});

app.get('/new_route', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'new_route.html'));
});

app.get('/tools', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'tools.html'));
});

app.get('/contactus', function(req, res) {
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'contactus.html'));
});
app.get('/texteditor',function(req,res){
  res.sendFile(path.join(__dirname, 'proj', 'pages', 'texteditor.html'));
});
// start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});

const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// a variable to save a session
var session;

app.post('/login', (req, res) => {
  session = req.session;
  session.Email = req.body.Email;
  session.Password = req.body.Password;
  console.log(req.session);
  res.redirect('/homepage')
});

app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
  console.log(req.session)
});
app.get('/checksession', (req, res) => {
  if (req.session && req.session.Email && req.session.Password) {
    res.send(true);
  } else {
    res.send(false);
  }
});
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/travel_buddy', { useNewUrlParser: true });
var db=mongoose.connection
app.post("/register",(req,res)=>{
  var name=req.body.Name;
  var email=req.body.Email;
  var password=req.body.Password;

  var data={
    "name":name,
    'email':email,
    "password":password
  }
  db.collection('registrations').insertOne(data,(err,collection)=>{
    if(err){
      throw err;
    }
    console.log("record inserted successfully");
    return res.redirect("/login")
  })
})

const request = require('request');

app.post('/query', (req, res) => {
  const formData = {
    src: req.body.source,
    dest: req.body.destination,
    date: req.body.date
  };

  request.post({ url: 'http://localhost:3000/menu', formData }, (err, httpResponse, body) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error submitting form data');
    }

    console.log('Form data submitted successfully');
    res.redirect('/menu');
  });
});

app.post('/menu', (req, res) => {
  const src = req.body.source;
  const dest = req.body.destination;
  const date = req.body.date;
  console.log(src,dest,date)
  // Do something with the form data (e.g. save to database)
  res.send('Form data received successfully');
});

app.post("/new_route",(req,res)=>{
  var src=req.body.source;
  var dest=req.body.destination;
  var date=req.body.date;
  var email=req.session.email;

  var data={
    "source":src,
    'destination':dest,
    "date":date,
    "email":email
  }
  db.collection('routes').insertOne(data,(err,collection)=>{
    if(err){
      throw err;
    }
    console.log("record inserted successfully");
    return res.redirect("/confirm")
  })
})

const assert = require('assert');
  // Define a route to add a new confirmed ride
  app.post('/confirm', (req, res) => {
    // Get the form data
    const src = req.body.source;
    const dest = req.body.destination;
    const date = req.body.date;
    const email = req.session.email;

    // Insert the ride into the "confirmed_rides" collection
    const collection = db.collection('confirmed_rides');
    collection.insertOne({ source: src, destination: dest, date: date, email: email }, (err, result) => {
      assert.equal(null, err);
      console.log('Ride added to database successfully');
      res.redirect('/');
    });
  });

  // Define a route to get the confirmed rides
  app.get('/rides', (req, res) => {
    const collection = db.collection('confirmed_rides');
    collection.find({}).toArray((err, docs) => {
      assert.equal(null, err);
      res.json(docs);
    });
  });

  // Define a route to serve the index.html file
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });