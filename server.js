const http = require('http');
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/index.html");
})


// socket.io set up
const io = require("socket.io")(server);
let users = {};

io.on("connection", (socket)=>{
    socket.on("new-user-joined",(username)=>{
        users[socket.id] = username;
        socket.broadcast.emit('user-connected',username);
        io.emit("user-list",users);
    });

    socket.on("disconnect",()=>{ //default event
        socket.broadcast.emit('user-disconnected',user=users[socket.id]); // user=users[socket.id] getting username
        delete users[socket.id];
        io.emit("user-list",users);
    });

    socket.on("message",(data)=>{
        socket.broadcast.emit("message",{user:data.user,
                                         msg : data.msg});
    });
})

server.listen(port, ()=>{
    console.log(`server listening on the port ${port}`);
})