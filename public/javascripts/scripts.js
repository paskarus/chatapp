var my_uuid = uuid();

$(function () {
    $("#signed-in-as").find('.user-id').text(' ' + my_uuid);

    var roomId = parseInt($("#room").data("room-id")),
        connectQuery = "room_id=" + roomId + "&uuid=" + my_uuid,
        socket = io.connect('', {query: connectQuery}),
        userItemsTemplate = _.template($("#user-item-template").html());

    socket.on('users_update', function (uuids) {
        var usersElement = $(".users");

        usersElement.empty();

        _.each(uuids, function (uuid) {
            usersElement.append(userItemsTemplate({uuid: uuid, current: uuid === my_uuid}))
        });
    });
});

function uuid() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}
