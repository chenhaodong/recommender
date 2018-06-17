var express = require('express');
var router = express.Router();

var itemMap = new Map();
var userMap = new Map();

router.post('/', function(req, res, next) {
    console.log('body' + req.body);
    readResult();
    res.send(JSON.stringify(userMap));
});

router.get('/search_user', function(req, res, next) {
    var userId = req.query.userId;
    console.log('userId: ' + userId);
    var itemIds = userMap[userId];
    var obj = {'items': itemIds};
    res.send(JSON.stringify(obj));
});

function execRAnalyzer() {
    const { exec } = require('child_process');
    exec('cat *.js bad_file | wc -l', (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}

function readResult() {
    var rf = require("fs");
    var raw = rf.readFileSync("./ranalyzer/result.txt", "utf-8");
    var lines = raw.split(/\r?\n/);
    for (i in lines) {
        var line = lines[i];
        if (!line.trim()) {
        	continue
        }
        var eles = line.split(':');
        console.log("line:" + line);
        itemId = eles[0];
        userIds = eles[1].split(',');
        itemMap[itemId] = userIds;
        for (index in userIds) {
            userId = userIds[index].replace(/\s/g, '');
            console.log(userMap[userId] + Array.isArray(userMap[userId]));
            userMap[userId] = userMap[userId] || [];
            userMap[userId].push(itemId);
        }
    }
}

module.exports = router;