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
            .then(function () {
                return res.send('Database removed!');
            }).catch(function (err) {
                res.statusCode = 500;
                console.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            })
    });

    //Sockets

    io.on('connection', function (client) {

        setRoom(client);

        db.loadData(Messages)
            .then(function (data) {
                for (var i = 0, n = data.length; i < n; i++) {
                    client.emit('message', data[i]);
                }
            }).catch(function (err) {
                console.error(err);
            });

        db.loadData(Rooms)
            .then(function (data) {
                sendRoomsList(client, data);
            }).catch(function (err) {
                console.error(err);
            });


        client.on('message', function (message) {
            try {
                client.emit('message', message);
                client.broadcast.to(client.room).emit('message', message);

                db.saveData(Messages, message);
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
        });

        client.on('createRoom', function (data) {
            db.loadOne(Rooms, {name: data})
                .then(function (result) {
                    if (result === null) {
                        return db.saveData(Rooms, {name: data});
                    }
                    else {
                        throw Error('Room not create');
                    }
                }).then(function () {
                    return db.loadData(Rooms);
                }).then(function (result) {
                    sendRoomsList(client, result);
                    broadcastRoomsList(client, result);
                }).catch(function (err) {
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

    function sendRoomsList(client, data) {
        client.emit('getRooms', {data: data, activeRoom: client.room});
    }

    function broadcastRoomsList(client, data) {
        client.broadcast.emit('getRooms', {data: data});
    }

}());