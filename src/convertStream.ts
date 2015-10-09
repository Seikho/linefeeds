import stream = require('stream');
import replace = require('./replace');
import fs = require('fs');
import LF = require('../index.d.ts');

export = ConvertStream;
class ConvertStream extends stream.Readable {
    constructor(input: string, options: LF.Options, isFile = true) {
        super();
        this.input = input;
        this.options = options;
        this.isFile = isFile;
    }
    
    input: string = '';
    options: LF.Options = null;
    isFile: boolean = true;

    _read(size: number): void {
        var callback = (err, content) => {
            if (err) throw new Error(`Failed to read file: ${err}`);
            if (typeof content !== 'string') content = content.toString(this.options.encoding);
            
            var newContent = replace(content, this.options.ending);

            this.push(newContent);
            this.push(null);
        }

        if (this.isFile) {
            return fs.readFile(this.input, { encoding: this.options.encoding }, callback);
        }
        
        callback(null, this.input);
    }
}
