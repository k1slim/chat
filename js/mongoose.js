(function () {
    var dbUrl = process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            'mongodb://localhost/test',

        mongoose = require('mongoose'),
        db;

    mongoose.connect(dbUrl);
    db = mongoose.connection;

    db.on('error', function () {
        console.error('Connection error:');
    });
    db.once('open', function () {
        console.log("Connected to DB!");
    });

    function loadData(model, criteria) {
        criteria=criteria || "";
        return model.find(criteria)
            .select('-_id -__v');
    }

    function loadOne(model, param) {
        return model.findOne(param)
            .select('-_id -__v');
    }

    function saveData(schema, data) {
        var savePromise;
        savePromise = new schema(data)
            .save(function (err) {
                if (err) {
                    throw err;
                }
            });
        return savePromise;
    }

    function removeData(shema) {
        return shema.remove();
    }

    module.exports = {
        loadData: loadData,
        loadOne: loadOne,
        saveData: saveData,
        removeData: removeData
    };

}());