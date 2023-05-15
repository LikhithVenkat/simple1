// Load Node modules
var express = require('express');
const ejs = require('ejs');
// Initialise Express
var app = express();
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(3000, function() {
    console.log('Server started on port 3000');
  });

// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    var name = "likhith";
    var listnames=[1,2,3,4,5,6,7,8,9];
    res.render('index',{
        name:name,
        listnames:listnames
    });
});