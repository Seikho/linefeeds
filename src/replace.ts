export = replace;

function replace(content: string, endings: string) {
    
    // Ensure we have one style of ending in the file
    var newContent = content.replace(new RegExp('(\r\n)|(\r \n)|(\R)', 'g'), '\n');

    return newContent.replace(new RegExp('\n', 'g'), endings);
}