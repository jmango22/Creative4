var express = require('express');
var fs = require('fs');
var request = require('request');
var router = express.Router();

// Load and store all the cities
var cities = [];
fs.readFile(__dirname + '/cities.dat.txt',function(err,data) {
    if(err) throw err;
    cities = data.toString().split("\n");
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('weather.html', {root: 'public' });
});

/* GET city */
router.get('/getcity', function(req, res, next) {
    var foundCities = [];
    var myRegex = "^";
    if(req.query.q) {
        var myRegex = new RegExp("^" + req.query.q.toLowerCase());
    }
    for(var i=0; i<cities.length; i++) {
        var lowercaseCity = cities[i].toLowerCase();
        if(lowercaseCity.search(myRegex) !== -1) {
            foundCities.push({ city: cities[i] });
        }
    }
    res.status(200).json(foundCities);
});

/* GET Owlbot proxy */
router.get('/owlbot', function(req, res, next) {
   console.log("In owlbot");
   console.log(req.query);
   var owlbot = 'https://owlbot.info/api/v1/dictionary/' + req.query.q;
   request(owlbot).pipe(res);
   
});

module.exports = router;
