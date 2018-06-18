var express = require('express');
var analyzer = require('./analyzer')
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    var items = [
        '123455',
        '123456',
        '123457',
        '123458',
        '123459',
        '123450',
        '123451',
    ]
    var obj = { 'items': items };

    console.log('body' + JSON.stringify(obj));
    res.send(JSON.stringify(obj))
});

router.get('/search_user', function(req, res, next) {
    var userId = req.query.userId;
    console.log('userId: ' + userId);
    console.log(JSON.stringify(analyzer.userMap, null, 4));
    var itemIds = analyzer.userMap[userId];
    var obj = { 'items': itemIds };
    res.send(JSON.stringify(obj));
});

router.get('/search_item', function(req, res, next) {
    var itemId = req.query.itemId;
    console.log('itemId: ' + itemId);
    console.log(JSON.stringify(analyzer.itemMap, null, 4));
    var userIds = analyzer.itemMap[itemId];
    var obj = { 'users': userIds };
    res.send(JSON.stringify(obj));
});

module.exports = router;