var port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var io = require('socket.io')(server);

server.listen(port);

app.use('/', express.static(__dirname + '/'));

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

    /*    fs.open(file, "a", 0644, function(err, file_handle){
     if(!err){
     fs.write(file_handle, JSON.stringify(data) + ',.', null, 'utf8', function(err){
     if(err){
     console.log(err);
     } else{
     fs.close(file_handle);
     }
     });
     } else{
     console.log(err);
     }
     });*/
};

var read = function(file, callback){
    fs.readFile(file, 'utf8', function(err, data){
        if(err){
            throw err;
        }
        callback(data);
    });

    /*fs.open(file, "r", 0644, function(err, file_handle){
     if(!err){
     fs.read(file_handle, 10000, null, 'utf8', function(err, data){
     if(!err){
     callback(data);
     fs.close(file_handle);
     } else{
     console.log(err);
     }
     });
     } else{
     console.log(err);
     }
     });*/
};

