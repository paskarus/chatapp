var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Demo Chat'});
});

router.get('/join', function (req, res, next) {
    var roomId = req.query.room;
    // TODO: init socket.io serer
    console.log(roomId);
    res.render('room', {title: 'Room ' + roomId, roomId: roomId});
});

module.exports = router;