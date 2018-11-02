var express = require('express');
var fs = require('fs');
var request = require('request');
var router = express.Router();

// Load and store all the cities
var battles = [];
fs.readFile(__dirname + '/revolution.data.txt',function(err,data) {
    if(err) throw err;
    var lines = data.toString().split("\n");
    for(var i = 1; i<lines.length; i++) {
        var line = lines[i].replace(/\n|\r/g, "");
        var battleLine = line.split(";");
        if (battleLine[7] && (battleLine[7] !== "")) {
            var location = battleLine[7].split(",");
            console.log(location);
            // battle;article;date;state;outcome;start_date;victory;battle_location
            var battle = {
                name: battleLine[0],
                article: battleLine[1],
                date: battleLine[2],
                state: battleLine[3],
                outcome: battleLine[4],
                start_date: battleLine[5],
                victory: battleLine[6],
                battle_location: {
                    lat: location[0].toString().trim(),
                    lng: location[1].toString().trim()
                }
            }
            console.log("battle: " + i);
            console.dir(battle);
            
            battles.push(battle);
        }
    }
    console.dir(battles);
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('index.html', {root: 'public' });
});

/* GET city */
router.get('/battles', function(req, res, next) {
    res.status(200).json(battles);
});

module.exports = router;
