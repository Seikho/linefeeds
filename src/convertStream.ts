import stream = require('stream');
import replace = require('./replace');
import fs = require('fs');
import LF = require('../index.d.ts');

export = ConvertStream;

class ConvertStream extends stream.Readable {
    constructor(public input: string, public options: LF.Options, public isFile = true) {
        super();
    }

    isDone = false;

    _read(size: number): void {

        if (this.isDone) {
            this.push(null);
            return;
        }

        if (this.isFile)
            return fs.readFile(this.input, { encoding: this.options.encoding }, this.convert);

        this.convert(null, this.input);
    }

    convert = (error?: any, content?: any) => {
        if (error) throw new Error(`Unable to read file: ${error}`);
        if (typeof content !== 'string') content = content.toString(this.options.encoding);

        var newContent = replace(content, this.options.ending);
        this.push(newContent);
        this.isDone = true;
    }
}