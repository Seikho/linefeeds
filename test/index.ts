import LF = require('../src');
import Types = require('../index.d.ts');
import chai = require('chai');
import replace = require('../src/replace');
import fs = require('fs');

var expect = chai.expect;

var cr = new RegExp('\r\n', 'g');
var lf = new RegExp('\n', 'g');

fs.writeFileSync('test.txt', '');

describe('conversion tests', () => {

    it('will replace all line endings with CRLF', () => {
        LF.convertSync('tsconfig.json', { target: 'test.txt', ending: LF.ending.crlf });

        expect(test('test.txt', cr)).to.be.true;       
    });

    it('will replace all line endings with LF', () => {
        LF.convertSync('tsconfig.json', { target: 'test.txt', ending: LF.ending.lf });

        expect(test('test.txt', cr)).to.be.false;
        expect(test('test.txt', lf)).to.be.true;
    });

});

describe('async tests', () => {
    it('will convert line endings to CRLF with callbacks', done => {
        var cb = (error?: any) => {
            expect(error).to.not.exist;
            expect(test('test.txt', cr)).to.be.true
            done();
        }

        LF.convert('tsconfig.json', { target: 'test.txt', ending: LF.ending.crlf }, cb)

    });

    it('will convert line endings to LF with callbacks', done => {
        var cb = (error?: any) => {
            expect(error).to.not.exist;
            expect(test('test.txt', cr)).to.be.false
            expect(test('test.txt', lf)).to.be.true;
            done();
        }

        LF.convert('tsconfig.json', { target: 'test.txt', ending: LF.ending.lf }, cb)
    });
});

describe('stream tests', () => {
   it('will convert line endings to CRLF with streams', done => {
      var stream = LF.stream('tsconfig.json', { ending: LF.ending.crlf });
      var buffer = '';
      stream.on('end', () => {          
          expect(cr.test(buffer)).to.be.true;
          done();
      });
      
      stream.on('data', data => {
          buffer += data;
      });
   });
   
   it('will convert line endings to LF with streams', done => {
      var stream = LF.stream('tsconfig.json', { ending: LF.ending.lf });
      var buffer = '';
      stream.on('end', () => {          
          expect(cr.test(buffer)).to.be.false;
          expect(lf.test(buffer)).to.be.true;
          done();
      });
      
      stream.on('data', data => {
          buffer += data;
      });
   });
});

function test(file: string, regex: RegExp) {
    var context = fs.readFileSync(file).toString();
    return regex.test(context);
}