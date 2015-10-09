import stream = require('stream');
import replace = require('./replace');
import fs = require('fs');
import LF = require('../index.d.ts');

export = convert;

class ConvertStream extends stream.Readable {
    constructor(input: string, options: LF.Options, isFile = true) {
        super();
        this.input = input;
        this.options = options;
        this.isFile = isFile;
        this._read = this._read.bind(this);
    }

    input: string = '';
    options: LF.Options = null;
    isFile: boolean = true;
    buffer: string = '';

    _read(size: number): void {
        var callback = (err, content) => {
            if (err) throw new Error(`Failed to read file: ${err}`);
            if (typeof content !== 'string') content = content.toString(this.options.encoding);

            var newContent = replace(content, this.options.ending);
            this.buffer += newContent;
            console.log(this.buffer);
            this.push(newContent);
            this.push(null);
        }

        if (this.isFile) {
            return fs.readFile(this.input, { encoding: this.options.encoding }, callback);
        }

        callback(null, this.input);
    }
}

function convert(input: string, options: LF.Options, isFile = true) {
    var Readable: any = stream.Readable;
    var buffer = '';

    return new Readable({
        read: function(size: number) {

            var callback = (err, content) => {
                if (err) throw new Error(`Failed to read file: ${err}`);
                if (typeof content !== 'string') content = content.toString(options.encoding);

                var newContent = replace(content, options.ending);
                buffer += newContent;
                this.push(newContent);
                this.push(null);
            }

            if (isFile) {
                return fs.readFile(input, callback);
            }

            else callback(null, input);
        }
    });
}