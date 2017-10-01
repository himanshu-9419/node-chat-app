var socket=io();
socket.on('connect', function ()  {
    var params=jQuery.deparam(window.location.search)
    //console.log(params);
    socket.emit('join',params,function(err){
        if(err){alert(err); window.location.href='/';}
        else {console.log('no error');}
    })
});
socket.on('disconnect',function ()  {
    console.log('disconnected from terminal');
});
socket.on('updateUserList',function(users){
    var ol= jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
    console.log('called');
    console.log('users are',users);
})
socket.on('newMessage',function(message){
    // console.log("new message",message);
     var formatedTime=moment(message.createdAt).format('h:mm a');
    // var li=jQuery('<li></li>');
    // li.text(`${message.from} ${formatedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
    var template=jQuery('#message-template').html();
    var html=Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formatedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});
socket.on('newLocationMessage',function(message){
    var formatedTime=moment(message.createdAt).format('h:mm a');
    // var li=jQuery('<li></li>');
    // var a=jQuery('<a target="_blank">My Current Location</a>');
    // li.text(`${message.from} ${formatedTime}: `);
    // a.attr('href',message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
    var template=jQuery('#locationMessage-template').html();
    var html=Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formatedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
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

function scrollToBottom(){
    //selectors
    var messages=jQuery('#messages');
    var newMessage =messages.children('li:last-child');
    //height
    var clientHeight=messages.prop('clientHeight');
    var scrollTop=messages.prop('scrollTop');
    var scrollHeight=messages.prop('scrollHeight');
    var newMessageHeight=newMessage.innerHeight();
    var lastMessageHeight=newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) messages.scrollTop(scrollHeight);
}