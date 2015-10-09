import LF = require('../index.d.ts');
import fs = require('fs');
import path = require('path');
import streams = require('stream');
import validate = require('./options');
import validateOptions = validate.validateOptions;

export function convertText(text: string, options: LF.Options, callback?: (error?: any) => void) {
    validateOptions(options);

    var newText = replace(text, options.ending);
    fs.writeFile(options.target, newText, callback);
}

export function convertTextSync(text: string, options: LF.Options) {
    validateOptions(options);
    var newText = replace(text, options.ending);
    fs.writeFileSync(options.target, newText, { encoding: options.encoding });
}

export function convertTextStream(text: string, options: LF.Options): NodeJS.ReadableStream {        
    return new StringStream(text, options, false);
}

export function convertSync(filename: string, options: LF.Options) {
    validateOptions(options);
    var inputFile = fs.readFileSync(filename).toString(options.encoding);

    var newFile = replace(inputFile, options.ending);
    fs.writeFileSync(options.target, newFile);
}

export function convert(filename: string, options: LF.Options, callback?: (error?: any) => void) {
    validateOptions(options);
    fs.readFile(filename, readCallback(options, callback));
}

export function stream(filename: string, options: LF.Options): NodeJS.ReadableStream {
    options = options || <any>{};
    options.target = 'stream';

    validateOptions(options);

    return new StringStream(filename, options);
}

export var ending = {
    crlf: '\r\n',
    lf: '\n'
};

function readCallback(options: LF.Options, callback?: (error?: any) => void) {
    return (readError?: any, content?: Buffer) => {
        if (!callback) return;
        if (readError) return callback(readError);
        fs.writeFile(options.target, content.toString(options.encoding), callback);
    }
}

function replace(content: string, endings: string) {
    
    // Ensure we have one style of ending in the file
    var newContent = content.replace(new RegExp('(\r\n)|(\r \n)|(\R)', 'g'), '\n');

    return newContent.replace(new RegExp('\n', 'g'), endings);
}

class StringStream extends streams.Readable {
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