"use strict";

module.exports = http;

var mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    config = require('./config'),
    logger = require('./logger');

function http(io) {
    mongo.connect(config.mongodb_url)
        .then(function (db) {

        var messages = db.collection('messages'),
            rooms = db.collection('rooms');

        rooms.drop();

        io.on('connection', function(socket) {
            // TODO: validate query params
            var uuid = socket.handshake.query.uuid,
                roomId = socket.handshake.query.room_id,
                roomName = "room_" + parseInt(roomId);

            messages.find({
                room_id: roomName
            }).limit(10).toArray()
                .then(function (res) {
                    if (res !== null) {
                        io.to(socket.id).emit('history', res);
                    }

                    rooms.findOneAndUpdate(
                        {name: roomName},
                        {$addToSet: {users: uuid}},
                        {upsert: true}
                    ).then(users_update).catch(logger.error);
                }).catch(logger.error);

            socket.on('message', function(room, msg){
                var message = {
                    room_id: roomName,
                    user: uuid,
                    text: msg,
                    created_at: new Date()
                };

                messages.insertOne(message).then(function () {
                    delete message.room_id;
                    delete message._id;

                    socket.broadcast.to(roomName).emit('new_message', message);
                }).catch(logger.error);
            });

            socket.on('disconnect', function () {
                rooms.findOneAndUpdate(
                    {name: roomName},
                    {$pull: {users: uuid}},
                    {new: true, upsert: true}
                ).then(users_update).catch(logger.error);
            });

            function users_update() {
                rooms.find({name: roomName}).limit(1).toArray()
                    .then(function (res) {
                        res = res[0];

                        socket.join(roomName);
                        if (res && 'users' in res) {
                            io.to(roomName).emit('users_update', res.users);
                        }
                    }).catch(logger.error);
            }
        });
    }).catch(logger.error);
}
