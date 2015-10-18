### Linefeeds
File line-endings conversion between CRLF and LF.  
TypeScript definitions included (1.6+)  

### Installation
```
npm install linefeeds --save
```

### Usage
Example:
```javascript
import lf = require('linefeeds');
import fs = require('fs');
var input = 'input.txt';

/**
 *  Without no output provided, it will replace the input file 
 */
var callback = error => console.log(error ? 'Failed to convert' : 'Successfully converted');

// Synchronously convert to LF
lf.convertSync(input, { ending: lf.lf });

// Asynchronously convert back to CRLF
lf.convert(input, { ending: lf.crlf }, callback);

// Use a stream convert to LF again
var write = fs.createWriteStream('output.txt');
lf.stream(input, { ending: lf.lf }).pipe(write);
```

Just want to convert a body of text that you already have in memory?  
No problem!
```javascript
var text = 'some\nbody\nof\ntext';
var target = 'output.txt';

// Asynchronously
lf.convertText(text, { ending: lf.crlf, target }, callback);

// Synchronously
lf.convertTextSync(text, { ending: lf.crlf ,target });

// Stream
var write = fs.createWriteStream(target);
lf.convertTextStream(text, { ending: lf.lf }).pipe(write);
```

### License
MIT
