var my_uuid = uuid(),
    room_id = 3;

$(function () {
    var connectQuery = "room_id=" + room_id + "&uuid=" + my_uuid,
        socket = io.connect('', {query: connectQuery});

    socket.on('users_update', function (users) {
        console.log('new users:', users);
    });
    console.log(connectQuery);
});

function uuid() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}
