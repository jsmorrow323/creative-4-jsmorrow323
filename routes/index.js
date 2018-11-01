var express = require('express');
var https = require('https');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('weather.html', { root: 'public' });
});

/* GET city page. */
router.get('/getcity', function (req, res, next) {
    console.log("In getcity route");
    fs.readFile(__dirname + '/cities.dat.txt',function(err,data) {
        if(err) throw err;
        
        var cities = data.toString().split("\n");
        
        var myRe = new RegExp("^" + req.query.q);
        console.log("MYRE: " + myRe);
        
        var jsonresult = [];
        for(var i = 0; i < cities.length; i++) {
            var result = cities[i].search(myRe); 
            if(result != -1) {
                console.log(cities[i]);
                jsonresult.push({city:cities[i]});
            } 
        }
        console.log("JSON RESULTS: " + jsonresult);
        res.status(200).json(jsonresult);
    });
});

/* GET words page. */
router.get("/owlRoute/:word", function (req, res, next) {
    console.log("In owlRoute route");
    // Get info from OWL api and return to weather.html
    var url = `https://owlbot.info/api/v1/dictionary/${req.params.word}`;
    console.log(url);
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            res.status(response.statusCode).send();
            return;
        }
        var output = [];
        response.setEncoding('utf8');
        response.on("data", function (data) {
            output.push(data);
        });
        response.on("end", function (data) {
            var owlJson = JSON.parse(output.join(''));
            res.status(200).json(owlJson);
        });
    }).on("error", function (data) {
        res.status(500).send();
    });
});
module.exports = router;
