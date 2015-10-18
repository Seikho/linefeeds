var path = require('path');
/**
 * Will throw if options are invalid
 */
function validateOptions(options, filename) {
    if (!options)
        throw new Error(exports.errors.NotSupplied);
    if (!options.ending)
        throw new Error(exports.errors.NoEnding);
    if (!options.encoding)
        options.encoding = 'utf8';
    if (!options.target && filename)
        options.target = filename;
    if (!options.target)
        throw new Error(exports.errors.NoTarget);
    options.target = path.resolve(options.target);
}
exports.validateOptions = validateOptions;
exports.errors = {
    NotSupplied: 'Invalid options: Options not provided',
    NoEnding: 'Invalid options: No line ending provided',
    NoTarget: 'Invalid options: Output target not provided'
};
