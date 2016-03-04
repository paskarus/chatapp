var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('room', {title: 'Demo Chat Public', roomId: 0});
});

router.get('/join', function (req, res, next) {
    var roomId = req.query.room;

    res.render('room', {title: 'Room ' + roomId, roomId: roomId});
});

module.exports = router;