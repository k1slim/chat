"use strict";
(function () {

    var port = process.env.PORT || 8080,

        express = require('express'),
        app = express(),
        io = require('socket.io')(app.listen(port)),
        db = require('./js/mongoose'),
        Messages = require('./js/models/messages'),
        Rooms = require('./js/models/rooms');

    //Routes

    app.use(express.static(__dirname + '/'));

    app.get('/', function (req, res) {                //TODO сделать защиту
        res.sendFile(__dirname + '/index.html');
    });

    app.get('/api/delete', function (req, res) {
        db.removeData(Messages)
            .then(() => {
                res.send('Database removed!');
            }).then(null, err => {
                res.statusCode = 500;
                console.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            });
    });

    db.loadOne(Rooms, {name: 'Lobby'})
        .then(result => {
            if (result === null) {
                return db.saveData(Rooms, {name: "Lobby"});
            }
            else {
                throw Error('Room already exists');
            }
        }).then(null, err => {
            console.error(err);
        });

    //Sockets

    io.on('connection', function (client) {
        setRoom(client);

        loadMessagesByRoom(client);

        db.loadData(Rooms)
            .then(data => {
                sendRoomsList(client, data);
            }).then(null, err => {
                console.error(err);
            });

        client.on('message', function (message) {
            try {
                client.emit('message', message);
                client.broadcast.to(client.room).emit('message', message);

                db.saveData(Messages, {msg: message, room: client.room});
            }
            catch (err) {
                console.error(err);
            }
        });

        client.on('nick', function (data) {
            client.nick = data;
            client.to(client.room).broadcast.emit('systemMessage', "\"" + data + "\"" + " has joined");
        });

        client.on('joinRoom', function (data) {
            client.to(client.room).broadcast.emit('systemMessage', "\"" + client.nick + "\"" + " has changed the room");
            setRoom(client, data);
            client.to(client.room).broadcast.emit('systemMessage', "\"" + client.nick + "\"" + " has joined to the room");
            loadMessagesByRoom(client);
        });

        client.on('createRoom', function (data) {
            db.loadOne(Rooms, {name: data})
                .then(result => {
                    if (result === null) {
                        return db.saveData(Rooms, {name: data});
                    }
                    else {
                        throw Error('Room already exists');
                    }
                }).then(() => {
                    return db.loadData(Rooms);
                }).then(result => {
                    sendRoomsList(client, result);
                    broadcastRoomsList(client, result);
                }).then(null, err => {
                    console.error(err);
                });
        });

        client.on('disconnect', function () {
            if (client.nick) {
                client.to(client.room).broadcast.emit('systemMessage', "\"" + client.nick + "\"" + " has quit");
            }
        });

    });

    function setRoom(socket, name) {
        name = name || 'Lobby';
        if (socket.room) {
            socket.leave(socket.room);
        }
        socket.room = name;
        socket.join(name);
    }

    function sendRoomsList(socket, data) {
        socket.emit('getRooms', {data: data, activeRoom: socket.room});
    }

    function broadcastRoomsList(socket, data) {
        socket.broadcast.emit('getRooms', {data: data});
    }

    function loadMessagesByRoom(socket, room) {
        room = room || socket.room;
        db.loadData(Messages, {room: room})
            .then(data => {
                for (let i = 0, n = data.length; i < n; i++) {
                    socket.emit('message', data[i].msg);
                }
            }).then(null, err => {
                console.error(err);
            });
    }

}());