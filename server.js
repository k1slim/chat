var port = process.env.PORT || 8080,
    dbUrl =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test';


var express = require('express'),
    app = express(),
    io = require('socket.io').listen(app.listen(port)),
    mongoose = require('mongoose'),
    Messages = require('./js/models/messages');

            //MongoDB

mongoose.connect(dbUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connected to DB!");
});

            //Routes

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/delete', function(req, res) {
    return Messages.remove(function(err) {
        if(!err){
            return res.send('Database removed!');
        }
        else{
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

io.sockets.on('connection', function(client){

    var callback = function(err, data){
        if(err){
            throw err;
        }
        else{
            for(var i = 0; i < data.length; i++){
                client.emit('message', data[i]);
            }
        }
    };

    Messages.find()
        .select('-_id message name time')
        .exec(callback);

    client.on('message', function(message){
        try{
            client.emit('message', message);
            client.broadcast.emit('message', message);

            new Messages(message)
                .save(function (err) {
                    if(err){
                        throw err;
                    }
                });

        } catch(e){
            console.log(e);
            client.disconnect();
        }
    });

    client.on('nick', function(data){
        client.nick=data;
        client.broadcast.emit('systemMessage',  "\"" + data + "\"" + " has joined");
    });

    client.on('disconnect',function(){
        if(client.nick){
            client.broadcast.emit('systemMessage', "\"" + client.nick + "\"" + " has quit");
        }
    })

});
