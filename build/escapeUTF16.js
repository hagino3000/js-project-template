#!/usr/bin/env node

/*
 UTF16Escape for JavaScript code

 This script translate text

 from
   console.log('あいうえお');
 to
   console.log('\u3042\u3044\u3046\u3048\u304a');

 Usage:
   unescape.js < infile.js > outfile.js
   or
   unescape.js -o outfile.js infile.js

 */

var argv = require('optimist').argv,
    fs = require('fs');

var options = {
  source: null,
  target: null
};

if (argv.o) options.target = argv.o;
if (argv._[0]) options.source = argv._[0];

if (argv.h || argv.help) {
  global.sys.print('Usage: unescape.js -o <output-file> <input-file>\n');
  process.exit(0);
}

if (options.source) {
  fs.readFile(options.source, 'utf8', function(error, text) {
    if (error) throw error;
    output(escapeUtf16(text));
  });
} else {
  var stdin = process.openStdin();
  stdin.setEncoding('utf-8');
  var text = '';
  stdin.on('data', function(chunk) { text += chunk; });
  stdin.on('end', function() { output(escapeUtf16(text)); });
}

function escapeUtf16(str) {
  return str.replace(/[\u0080-\uffff]/g, function(c) {
          var code = c.charCodeAt(0).toString(16);
          while (code.length < 4) code = "0" + code;
          return "\\u" + code;
  });
}

function output(escaped) {
  if (options.target) {
    var out = fs.createWriteStream(options.target, { flags: 'w', encoding: 'utf-8', mode: 0644 });
    out.write(escaped);
    out.end();
  } else {
    process.stdout.write(escaped);
  }
  
};
