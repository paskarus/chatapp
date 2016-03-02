$(function () {
    var user_uuid = uuid();
    console.log(user_uuid);
});

function uuid() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}
