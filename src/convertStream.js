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
        var _this = this;
        if (isFile === void 0) { isFile = true; }
        _super.call(this);
        this.input = input;
        this.options = options;
        this.isFile = isFile;
        this.isDone = false;
        this.convert = function (error, content) {
            if (error)
                throw new Error("Unable to read file: " + error);
            if (typeof content !== 'string')
                content = content.toString(_this.options.encoding);
            var newContent = replace(content, _this.options.ending);
            _this.push(newContent);
            _this.isDone = true;
        };
    }
    ConvertStream.prototype._read = function (size) {
        if (this.isDone) {
            this.push(null);
            return;
        }
        if (this.isFile)
            return fs.readFile(this.input, { encoding: this.options.encoding }, this.convert);
        this.convert(null, this.input);
    };
    return ConvertStream;
})(stream.Readable);
module.exports = ConvertStream;
