var fs = require('fs');
var path = require('path');
var replace = require('./replace');
var validate = require('./options');
var validateOptions = validate.validateOptions;
var ConvertStream = require('./convertStream');
function convertText(text, options, callback) {
    validateOptions(options);
    var newText = replace(text, options.ending);
    fs.writeFile(options.target, newText, callback);
}
exports.convertText = convertText;
function convertTextSync(text, options) {
    validateOptions(options);
    var newText = replace(text, options.ending);
    fs.writeFileSync(options.target, newText, { encoding: options.encoding });
}
exports.convertTextSync = convertTextSync;
function convertTextStream(text, options) {
    return ConvertStream(text, options, false);
}
exports.convertTextStream = convertTextStream;
function convertSync(filename, options) {
    validateOptions(options);
    var inputFile = fs.readFileSync(path.resolve(filename)).toString(options.encoding);
    var newFile = replace(inputFile, options.ending);
    fs.writeFileSync(options.target, newFile);
}
exports.convertSync = convertSync;
function convert(filename, options, callback) {
    validateOptions(options);
    fs.readFile(path.resolve(filename), readCallback(options, callback));
}
exports.convert = convert;
function stream(filename, options) {
    options = options || {};
    options.target = 'stream';
    validateOptions(options);
    return ConvertStream(path.resolve(filename), options);
}
exports.stream = stream;
exports.ending = {
    crlf: '\r\n',
    lf: '\n'
};
function readCallback(options, callback) {
    return function (readError, content) {
        if (!callback)
            return;
        if (readError)
            return callback(readError);
        var newContent = replace(content.toString(options.encoding), options.ending);
        fs.writeFile(options.target, newContent, callback);
    };
}
