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
    ConvertStream.prototype._read = function (size) {
        if (this.buffer !== null) {
            this.push(this.buffer);
            this.buffer = null;
        }
        this.push(null);
    };
    return ConvertStream;
})(stream.Readable);
module.exports = ConvertStream;
