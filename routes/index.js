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
            var battle = {
                name: battleLine[0],
                article: battleLine[1],
                date: battleLine[2],
                state: battleLine[3],
                outcome: battleLine[4],
                start_date: battleLine[5],
                victory: battleLine[6],
                battle_location: {
                    lat: parseFloat(location[0].toString().trim()),
                    lng: parseFloat(location[1].toString().trim())
                }
            }
            var wikipediaTitle = battle.article.substring(battle.article.lastIndexOf('/') + 1).replace(/_/g, '%20');
            var url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${wikipediaTitle}&exintro=&explaintext=&redirects=&format=json`;
            (function(battle) {
                request(url, { json: true }, (err, res, body) => {
                    if (err) { return console.log(err); }
                    var data = body.query.pages;
                    var key = Object.keys(data)[0];
                    battle.content = data[key].extract;
                    battles.push(battle);
                });
            })(battle);
        }
    }
});

/* GET battles */
router.get('/battles', function(req, res, next) {
    res.status(200).json(battles);
});

module.exports = router;
