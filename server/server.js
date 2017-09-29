const path=require('path');
const http=require('http');
const publicPath=path.join(__dirname,'/..','/public');
const express=require('express');
const socketIO=require('socket.io');
const port=process.env.PORT || 3000;

var app=express();
var server=http.createServer(app);
app.use(express.static(publicPath));
var io=socketIO(server);
io.on('connection',(socket)=>{
    console.log("new user connected");
    socket.on('disconnect',() => {
        console.log('client disconnected');
    });
    socket.emit('newEmail',{
        "from":"Mike",
        "text":"whats going on",
        "createAt":"123"
    });
    socket.emit('newMessage',{
        "from":"Mike",
        "text":"whats going on",
        "createAt":"123"
    });
    socket.on('createMessage',(data)=>{
        console.log("msg getting from user", data);
    })
    socket.on('createEmail',(data)=>{
        console.log("mail getting from user");
    })
});

server.listen(port,()=>{
    console.log('server is up on port 3000');
})