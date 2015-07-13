var port = process.env.PORT || 8080;

var express = require('express'),
    app = express(),
    fs = require('fs'),
    io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(client){

    var callback = function(data){
        var res = data.split(',.');
        for(var i = 0; i < res.length - 1; i++){
            client.emit('message', JSON.parse(res[i]));
        }
    };

    read("test.txt", callback);
    client.on('message', function(message){
        try{
            client.emit('message', message);
            client.broadcast.emit('message', message);
            write("test.txt", message);
        } catch(e){
            console.log(e);
            client.disconnect();
        }
    });


});

var write = function(file, data){
    fs.appendFile(file, JSON.stringify(data) + ',.', 'utf8', function(err){
        if(err){
            throw err;
        }
    });
};

var read = function(file, callback){
    fs.readFile(file, 'utf8', function(err, data){
        if(err){
            throw err;
        }
        callback(data);
    });
};

