import stream = require('stream');
import replace = require('./replace');
import fs = require('fs');
import LF = require('../index.d.ts');

export = ConvertStream;
class ConvertStream extends stream.Readable {
    constructor(input: string, options: LF.Options, isFile = true) {
        super();

        if (isFile) {
            fs.createReadStream(input, { encoding: options.encoding })
                .on('data', data => this.buffer += replace(data.toString(), options.ending));
            return;
        }
        
        if (typeof input !== 'string') input = input.toString();        
        this.buffer = replace(input, options.ending);

    }
    buffer: string = null;

    _read(size: number): void {
        if (this.buffer !== null) {
            this.push(this.buffer);
            this.buffer = null;
        }

        this.push(null);
    }
}