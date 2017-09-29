var socket=io();
socket.on('connect', function ()  {
    console.log('connected to server');
});
socket.on('disconnect',function ()  {
    console.log('disconnected from terminal');
});
socket.on('newMessage',function(message){
    console.log("new message",message);
    var li=jQuery('<li></li>');
    li.text(`${message.from} ${message.text}`);
    jQuery('#messages').append(li);
});
// socket.emit('createMessage',{
//     "from":"Mike",
//     "text":"whats going on",
//     "createAt":"123"
// },function(acknowledgement){
//     console.log(acknowledgement);
// });

jQuery("#message-form").on('submit',function (e){
    e.preventDefault();
    socket.emit('createMessage',{
        "from":"User",
        "text":jQuery('[name=message]').val()
    },function(acknowledgement){
        console.log(acknowledgement);
    });
})