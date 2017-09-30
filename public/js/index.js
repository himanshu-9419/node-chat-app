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
socket.on('newLocationMessage',function(message){
    var li=jQuery('<li></li>');
    var a=jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from} :`);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
})
// socket.emit('createMessage',{
//     "from":"Mike",
//     "text":"whats going on",
//     "createAt":"123"
// },function(acknowledgement){
//     console.log(acknowledgement);
// });

jQuery("#message-form").on('submit',function (e){
    e.preventDefault();
    var messageTextBox=jQuery('[name=message]');
    socket.emit('createMessage',{
        "from":"User",
        "text":messageTextBox.val()
    },function(acknowledgement){
        messageTextBox.val("");
        console.log(acknowledgement);
    });
});

var locationButton = jQuery("#send-location");
locationButton.on('click',function(){
    if(!navigator.geolocation) return alert('Geolocation not supported by your browser');
    locationButton.attr('disabled','disabled').text("sending location .....");
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage',{latitude:position.coords.latitude,longitude:position.coords.longitude});      
    },function(){
        alert('unable to fetch location');
        locationButton.removeAttr('disabled').text('Send Location');
    })
})