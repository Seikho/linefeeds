var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var streams = require('stream');
var validate = require('./options');
var validateOptions = validate.validateOptions;
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
    return new StringStream(text, options, false);
}
exports.convertTextStream = convertTextStream;
function convertSync(filename, options) {
    validateOptions(options);
    var inputFile = fs.readFileSync(filename).toString(options.encoding);
    var newFile = replace(inputFile, options.ending);
    fs.writeFileSync(options.target, newFile);
}
exports.convertSync = convertSync;
function convert(filename, options, callback) {
    validateOptions(options);
    fs.readFile(filename, readCallback(options, callback));
}
exports.convert = convert;
function stream(filename, options) {
    options = options || {};
    options.target = 'stream';
    validateOptions(options);
    return new StringStream(filename, options);
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
        fs.writeFile(options.target, content.toString(options.encoding), callback);
    };
}
function replace(content, endings) {
    // Ensure we have one style of ending in the file
    var newContent = content.replace(new RegExp('(\r\n)|(\r \n)|(\R)', 'g'), '\n');
    return newContent.replace(new RegExp('\n', 'g'), endings);
}
var StringStream = (function (_super) {
    __extends(StringStream, _super);
    function StringStream(input, options, isFile) {
        var _this = this;
        if (isFile === void 0) { isFile = true; }
        _super.call(this);
        this.buffer = null;
        if (isFile) {
            fs.createReadStream(input, { encoding: options.encoding })
                .on('data', function (data) { return _this.buffer += replace(data.toString(), options.ending); });
            return;
        }
        if (typeof input !== 'string')
            input = input.toString();
        this.buffer = replace(input, options.ending);
    }
    StringStream.prototype._read = function (size) {
        if (this.buffer !== null) {
            this.push(this.buffer);
            this.buffer = null;
        }
        this.push(null);
    };
    return StringStream;
})(streams.Readable);
