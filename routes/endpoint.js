var express = require('express');
var analyzer = require('./analyzer')
var router = express.Router();

router.get('/search_user', function(req, res, next) {
    var userIdRaw = req.query.userId;
    var itemIds = [];
    var userIds = userIdRaw.split(',');
    console.log('userIds: ' + userIds);
    for (index in userIds) {
        var userId = userIds[index];
        console.log('userId:' + userId);
        console.log(JSON.stringify(analyzer.userMap, null, 4));
        if (analyzer.userMap[userId]) {
            itemIds = itemIds.concat(analyzer.userMap[userId]);
        }
        console.log(itemIds);
    }
    uniqueItems = itemIds.filter(function(item, pos) {
        return itemIds.indexOf(item) == pos;
    });
    var obj = { 'items': uniqueItems };
    res.send(JSON.stringify(obj));
});

router.get('/search_item', function(req, res, next) {
    var itemIdRaw = req.query.itemId;
    var userIds = [];
    var itemIds = itemIdRaw.split(',');
    console.log('itemIds: ' + itemIds);
    for (index in itemIds) {
        var itemId = itemIds[index];
        console.log('itemId:' + itemId);
        console.log(JSON.stringify(analyzer.itemMap, null, 4));
        if (analyzer.itemMap[itemId]) {
            userIds = userIds.concat(analyzer.itemMap[itemId]);
        }
        console.log(userIds);
    }
    uniqueUsers = userIds.filter(function(user, pos) {
        return userIds.indexOf(user) == pos;
    });
    var obj = { 'users': uniqueUsers };
    res.send(JSON.stringify(obj));
});

module.exports = router;