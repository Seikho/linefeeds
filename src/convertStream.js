var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream = require('stream');
var replace = require('./replace');
var fs = require('fs');
var ConvertStream = (function (_super) {
    __extends(ConvertStream, _super);
    function ConvertStream(input, options, isFile) {
        if (isFile === void 0) { isFile = true; }
        _super.call(this);
        this.input = '';
        this.options = null;
        this.isFile = true;
        this.buffer = '';
        this.input = input;
        this.options = options;
        this.isFile = isFile;
        this._read = this._read.bind(this);
    }
    ConvertStream.prototype._read = function (size) {
        var _this = this;
        var callback = function (err, content) {
            if (err)
                throw new Error("Failed to read file: " + err);
            if (typeof content !== 'string')
                content = content.toString(_this.options.encoding);
            var newContent = replace(content, _this.options.ending);
            _this.buffer += newContent;
            console.log(_this.buffer);
            _this.push(newContent);
            _this.push(null);
        };
        if (this.isFile) {
            return fs.readFile(this.input, { encoding: this.options.encoding }, callback);
        }
        callback(null, this.input);
    };
    return ConvertStream;
})(stream.Readable);
function convert(input, options, isFile) {
    if (isFile === void 0) { isFile = true; }
    var Readable = stream.Readable;
    var buffer = '';
    return new Readable({
        read: function (size) {
            var _this = this;
            var callback = function (err, content) {
                if (err)
                    throw new Error("Failed to read file: " + err);
                if (typeof content !== 'string')
                    content = content.toString(options.encoding);
                var newContent = replace(content, options.ending);
                buffer += newContent;
                _this.push(newContent);
                _this.push(null);
            };
            if (isFile) {
                return fs.readFile(input, callback);
            }
            else
                callback(null, input);
        }
    });
}
module.exports = convert;
