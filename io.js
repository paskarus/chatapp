"use strict";

module.exports = http;

function http(io) {
    console.log('io started');
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        })
    })
}
