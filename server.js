var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];
usernameCurrent = '';
chat = [];

server.listen(process.env.PORT || 5000);
console.log('Running...');
app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
});
 
io.sockets.on('connection', function(socket){

    connections.push(socket);
    console.log('Connected: %d sockets connected', connections.length);

    // Disconnect 
   socket.on('disconnect',function(){       
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %d sockets connected', connections.length);
   });
   // Send Message
   socket.on('send message', function(data){
        //console.log(data);
        chat.push({ user: socket.username, message: data});
        io.sockets.emit('new message', chat);        
        usernameCurrent = socket.username;
   });

   // New user
   socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;        
        usernameCurrent = socket.username;
        users.push(socket.username);       
        updateUsernames();
   });

   function updateUsernames(){
        io.sockets.emit('get users', users);
   }
});