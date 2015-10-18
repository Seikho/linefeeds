import LF = require('../index.d.ts');
import fs = require('fs');
import path = require('path');
import replace = require('./replace');
import validate = require('./options');
import validateOptions = validate.validateOptions;
import ConvertStream = require('./convertStream');

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

export function convertTextStream(text: string, options: LF.Options) {
    return new ConvertStream(text, options, false);
}

export function convertSync(filename: string, options: LF.Options) {
    validateOptions(options, filename);
    var inputFile = fs.readFileSync(path.resolve(filename)).toString(options.encoding);

    var newFile = replace(inputFile, options.ending);
    fs.writeFileSync(options.target, newFile);
}

export function convert(filename: string, options: LF.Options, callback?: (error?: any) => void) {
    validateOptions(options, filename);
    fs.readFile(path.resolve(filename), readCallback(options, callback));
}

export function stream(filename: string, options: LF.Options) {
    options = options || <any>{};
    options.target = 'stream';

    validateOptions(options);

    return new ConvertStream(path.resolve(filename), options);
}


export var crlf = '\r\n';
export var lf = '\n';


function readCallback(options: LF.Options, callback?: (error?: any) => void) {
    return (readError?: any, content?: Buffer) => {
        if (!callback) return;
        if (readError) return callback(readError);

        var newContent = replace(content.toString(options.encoding), options.ending);
        fs.writeFile(options.target, newContent, callback);
    }
}



