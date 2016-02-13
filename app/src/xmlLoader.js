var config = require('./config');
var fs = require('fs');
var parser = require('xml2js').Parser();
var xmlDir = config.get('chummerSettings:xmlDirectory');

module.exports = {
    listXmlFiles: function (callback) {
        fs.readdir(xmlDir, callback);
    },

    loadXmlFile: function (filename, callback) {
        fs.readFile(xmlDir + filename, function (err, data) {
            if (err) {
                callback(err);
                return;
            }

            parser.parseString(data, function (err, result) {
                callback(err, result);
            })
        })
    }
};