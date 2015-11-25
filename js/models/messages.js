(function () {
    var mongoose = require('mongoose'),
        messages = mongoose.Schema({
            message: String,
            name: String,
            time: String
        });

    module.exports = mongoose.model('Messages', messages);
}());