var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/join', function(req, res, next) {
  var roomId = req.query.room;
  console.log(roomId);
  res.render('index', { title: 'Room ' + roomId });
});

module.exports = router;
