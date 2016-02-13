var config = require('./config');
var moment = require('moment');
var util = require('util');
var _ = require('lodash');

var Logger = function(tag) {
    this.debugLog = config.get('logger:debug');
    this.logTag = tag;
};

Logger.prototype.formatMsg = function(msg) {
    msg = _.values(msg);
    return util.format.apply(null, msg);
};

Logger.prototype.log = function(severity) {
    var msg = this.formatMsg(arguments[1]);
    console.log('[ %s | %s | %s ]: %s', moment().format('YYYY-MM-DD HH:mm:ss.SSS'), this.logTag, severity, msg);
};

Logger.prototype.info = function() {
    this.log('INFO', arguments);
};

Logger.prototype.error = function() {
    this.log('ERROR', arguments);
};

Logger.prototype.exception = function(ex) {
    if (_.has(ex, 'stack')) {
        this.log('EXCEPTION', '');
        console.log(ex.stack);
    } else {
        this.log('ERROR', [ex]);
    }
};

Logger.prototype.debug = function() {
    if (this.debugLog) {
        this.log('DEBUG', arguments);
    }
};

module.exports = {
    getLogger: function(tag) {
        return new Logger(tag);
    }
};