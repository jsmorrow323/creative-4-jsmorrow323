var express = require('express');
var https = require('https');
var crypto = require('crypto');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { root: 'public' });
});

/* GET Marvel API. */
router.get("/api/:word", function (req, res, next) {
    const publicapikey = `9bad5f95cb6de3695232e0b392317c17`;
    const privateapikey = `e6b3ffe5845cffeb9da4bacd494f71ee2ec5ce85`;
    const ts = Date.now();
    const hashdata = `${ts}${privateapikey}${publicapikey}`;
    const hash = crypto.createHash('md5').update(hashdata).digest("hex");
    var url = `https://gateway.marvel.com:443/v1/public/characters?name=${req.params.word}&apikey=${publicapikey}&ts=${ts}&hash=${hash}`;
    console.log(url);
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            res.status(response.statusCode).send();
            return;
        }
        var output = [];
        response.setEncoding('utf8');
        response.on("data", function (data) {
            console.log("data receieved");
            output.push(data);
        });
        response.on("end", function () {
            console.log("data end");
            var data = JSON.parse(output.join(''));
            res.status(200).json(data);
        });
    }).on("error", function (data) {
        res.status(500).send();
    });
    
});
module.exports = router;