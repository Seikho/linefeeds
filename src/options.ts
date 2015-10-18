import LF = require('../index.d.ts');
import path = require('path');

/**
 * Will throw if options are invalid
 */
export function validateOptions(options: LF.Options, filename?: string): void {
    if (!options) throw new Error(errors.NotSupplied)
    if (!options.ending) throw new Error(errors.NoEnding);
    if (!options.encoding) options.encoding = 'utf8';
    
    if (!options.target && filename) options.target = filename;
    if (!options.target) throw new Error(errors.NoTarget);
    
    options.target = path.resolve(options.target);
}

export var errors = {
    NotSupplied: 'Invalid options: Options not provided',
    NoEnding: 'Invalid options: No line ending provided',
    NoTarget: 'Invalid options: Output target not provided'
}