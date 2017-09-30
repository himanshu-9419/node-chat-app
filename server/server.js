const path=require('path');
const http=require('http');
const publicPath=path.join(__dirname,'/..','/public');
const express=require('express');
const socketIO=require('socket.io');
const port=process.env.PORT || 3000;
const {generateMessage,generateLocationMessage}=require('./utils/message.js');

var app=express();
var server=http.createServer(app);
app.use(express.static(publicPath));
var io=socketIO(server);
io.on('connection',(socket)=>{
    console.log("new user connected");
    socket.emit('newMessage',generateMessage("Admin","Welcome to chat"));
    socket.broadcast.emit('newMessage',generateMessage("Admin","new user joined"));
    socket.on('disconnect',() => {console.log('client disconnected');});
    socket.emit('newMessage',generateMessage("Mike","whats going on"));
    socket.on('createMessage',(message,callback)=>{
        console.log("msg getting from user", message);
        // io.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt: new Date().getTime()
        // })
        socket.broadcast.emit('newMessage',generateMessage(message.from,message.text));
        socket.emit('newMessage',generateMessage(message.from,message.text));
        callback('this is from server');
    })
    socket.on('createLocationMessage',(cords)=>{
        io.emit('newLocationMessage',generateLocationMessage('admin',cords.latitude, cords.longitude));
    })
    // socket.on('createEmail',(data)=>{
    //     console.log("mail getting from user");
    // })
});

server.listen(port,()=>{
    console.log('server is up on port 3000');
})