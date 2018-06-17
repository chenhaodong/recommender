var express = require('express');
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
	var obj = {'items': items};

	console.log('body' + JSON.stringify(obj));
	res.send(JSON.stringify(obj))
});



module.exports = router;
