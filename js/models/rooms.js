(function () {
    var mongoose = require('mongoose'),
        rooms = mongoose.Schema({
            name: { type:String, unique: true }
        });

    module.exports = mongoose.model('Rooms', rooms);
}());