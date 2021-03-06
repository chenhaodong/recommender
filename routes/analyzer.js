var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var router = express.Router();

var itemMap = new Map();
var userMap = new Map();


router.post('/', function(req, res, next) {
    readResult();
    res.send(JSON.stringify(userMap));
});

router.post('/upload', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        try {
            console.log(files.files);
            var oldpath = files.files.path;
            var newpath = './ranalyzer/source_data.csv';
            fs.rename(oldpath, newpath, function(err) {
                if (err) {
                    res.status(400);
                    res.render('error', { error: err });
                    return
                }
                execRAnalyzer(function(err) {
                    if (err) {
                        res.status(400);
                        res.render('error', { error: err });
                        res.end();
                        return
                    }
                    readResult(function(err) {
                        if (err) {
                            res.status(400);
                            res.render('error', { error: err });
                            res.end();
                            return
                        } else {
                            res.write('exec success');
                            res.end();
                        }
                    });
                });
            });
        } catch (err) {
            res.status(400);
            res.render('error', { error: err });
            res.end();
        }
    });
});

router.get('/search_user', function(req, res, next) {
    var userId = req.query.userId;
    console.log('userId: ' + userId);
    var itemIds = userMap[userId];
    var obj = { 'items': itemIds };
    res.send(JSON.stringify(obj));
});

function execRAnalyzer(callback) {
    var cp = require('child_process');
    cp.exec('cd ranalyzer && Rscript main.R', (err, stdout, stderr) => {
        if (err) {
            callback(err);
        } else {
            callback();
        }
        // the *entire* stdout and stderr (buffered)
        //console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}

function readResult(callback) {
    var rf = require("fs");
    try {
        var raw = rf.readFileSync("./ranalyzer/result.txt", "utf-8");
        var lines = raw.split(/\r?\n/);
    } catch (err) {
        callback(err);
    }
    userMap = new Map();
    itemMap = new Map();
    for (i in lines) {
        var line = lines[i];
        if (!line.trim()) {
            continue
        }
        var eles = line.split(':');
        itemId = eles[0];
        userIds = eles[1].split(',');
        userIds = userIds.map(function(e) {
            return e.replace(/\s/g, '');
        });
        itemMap[itemId] = userIds;
        for (index in userIds) {
            userId = userIds[index].replace(/\s/g, '');
            //console.log(userMap[userId] + Array.isArray(userMap[userId]));
            userMap[userId] = userMap[userId] || [];
            userMap[userId].push(itemId);
        }
    }
    module.exports.itemMap = itemMap;
    module.exports.userMap = userMap;
    callback();
}

module.exports = router;
module.exports.itemMap = itemMap;
module.exports.userMap = userMap;
module.exports.readResult = readResult;