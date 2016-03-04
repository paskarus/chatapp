"use strict";

module.exports = http;

var mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    config = require('./config'),
    logger = require('./logger');

function http(io) {
    mongo.connect(config.mongodb_url)
        .then(function (db) {

        var users = db.collection('users'),
            rooms = db.collection('rooms');

        // cleaning up (assume this is an only instance of backend)
        users.drop();
        rooms.drop();

        io.on('connection', function(socket) {
            // TODO: validate query params
            var uuid = socket.handshake.query.uuid,
                roomId = socket.handshake.query.room_id,
                roomName = "room_" + parseInt(roomId);

            console.log(uuid, 'connected to', roomName);

            rooms.findOneAndUpdate(
                {name: roomName},
                {$addToSet: {users: uuid}},
                {new: true, upsert: true}
            ).then(users_update).catch(logger.error);

            socket.on('message', function(room, msg){
                // TODO: handle message
                io.emit('chat message', msg);
            });

            socket.on('disconnect', function () {
                rooms.findOneAndUpdate(
                    {name: roomName},
                    {$pull: {users: uuid}},
                    {new: true, upsert: true}
                ).then(users_update).catch(logger.error);
            });

            function users_update() {
                rooms.findOne({name: roomName})
                    .then(function (res) {
                        console.log('@@@ result2', res);
                        socket.join(roomName);
                        io.to(roomName).emit('users_update', res.users);
                    }).catch(logger.error);
            }
        });

        io.on('disconnect', function(socket){
            // TODO: cleanup
            console.log("user disconnected");
        });
    }).catch(logger.error);
}

function cleanup() {

}