(function () {
    var mongoose = require('mongoose'),
        messages = mongoose.Schema({
            msg: {
                message: String,
                name: String,
                time: String
            },
            room: String

        });

    module.exports = mongoose.model('Messages', messages);
}());