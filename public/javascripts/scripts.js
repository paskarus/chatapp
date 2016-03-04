var my_uuid = uuid();

$(function () {
    $("#signed-in-as").find('.user-id').text(' ' + my_uuid);

    var roomId = parseInt($("#room").data("room-id")),
        connectQuery = "room_id=" + roomId + "&uuid=" + my_uuid,
        socket = io.connect('', {query: connectQuery}),
        messagesElement = $(".messages"),
        userItemsTemplate = _.template($("#user-item-template").html()),
        messagesItemsTemplate = _.template($("#messages-item-template").html());

    socket.on('users_update', function (uuids) {
        var usersElement = $(".users");

        usersElement.empty();

        _.each(uuids, function (uuid) {
            usersElement.append(userItemsTemplate({uuid: uuid, current: uuid === my_uuid}))
        });
    });

    socket.on('new_message', function (message) {
        messagesElement.append(messagesItemsTemplate(message))
    });

    socket.on('history', function (messages) {
        messagesElement.empty();

        if (!Array.isArray(messages)) {
            return
        }

        _.each(messages, function (message) {
            messagesElement.append(messagesItemsTemplate(message))
        });
    });

    $("#send").on('click', function (e) {
        e.preventDefault();

        var val = $.trim($("#message-input").val());

        if (val === '') {
            return;
        }

        var message = {
            user: my_uuid,
            text: val
        };

        socket.emit('message', 'room' + roomId, val);
        messagesElement.append(messagesItemsTemplate(message));
        $("#message-input").val('');
    });

    $("#message-input").on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            $("#send").click();
        }
    })
});

function uuid() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}
