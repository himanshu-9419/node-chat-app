var socket=io();
socket.on('connect', function ()  {
    console.log('connected to server');
});
socket.on('disconnect',function ()  {
    console.log('disconnected from terminal');
});

socket.on('newEmail',function(emailData){
    console.log("new email",emailData);
});
socket.emit('createEmail',{});
socket.on('newMessage',function(emailData){
    console.log("new email",emailData);
});
socket.emit('createMessage',{
    "from":"Mike",
    "text":"whats going on",
    "createAt":"123"
});