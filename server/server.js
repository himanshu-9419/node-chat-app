const path=require('path');
const http=require('http');
const publicPath=path.join(__dirname,'/..','/public');
const express=require('express');
const socketIO=require('socket.io');
const port=process.env.PORT || 3000;
const {generateMessage,generateLocationMessage}=require('./utils/message.js');
const {isRealString}=require('./utils/validation.js');
const {Users}=require('./utils/user.js');

var app=express();
var server=http.createServer(app);
app.use(express.static(publicPath));
var io=socketIO(server);
var users= new Users();
io.on('connection',(socket)=>{
    console.log("new user connected");
    
    socket.on('join',(params,callback)=>{
        debugger;
        if(!isRealString(params.name)||!isRealString(params.room)) {callback('name and room is required');}
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));        
        socket.emit('newMessage',generateMessage("Admin","Welcome to chat"));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin",`${params.name} joined`));
        callback();
    })
    socket.on('disconnect',() => {
        var user=users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left chat`));
        }
        console.log('client disconnected');
    });
    socket.emit('newMessage',generateMessage("Mike","whats going on"));
    socket.on('createMessage',(message,callback)=>{
        var user=users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
        }
        // io.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt: new Date().getTime()
        // })
        //socket.broadcast.emit('newMessage',generateMessage(message.from,message.text));
        //socket.emit('newMessage',generateMessage(message.from,message.text));
        callback();
    })
    socket.on('createLocationMessage',(cords)=>{
        var user=users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,cords.latitude, cords.longitude));
        }
        //io.emit('newLocationMessage',generateLocationMessage('admin',cords.latitude, cords.longitude));
    })
    // socket.on('createEmail',(data)=>{
    //     console.log("mail getting from user");
    // })
});

server.listen(port,()=>{
    console.log('server is up on port 3000');
})