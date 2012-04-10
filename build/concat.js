#!/usr/bin/env node

var argv = require('optimist').argv,
    mu = require('mu2'),
    fs = require('fs'),
    templateFile, rootDir,
    targetPath;

if (!argv.root || !argv.template || argv.h || argv.help) {
  console.log('Usage: concat.js --root <root directory> --template <template-filename> [-o <output-file>]');
  process.exit(0);
}

if (argv.o) targetPath = argv.o;
if (argv.template) templateFile = argv.template;
if (argv.root) rootDir = argv.root;


var buffer = '';

mu.root = rootDir;
mu.compileAndRender(templateFile, {})
  .on('data', function (data) {
    buffer += data.toString();
  })
  .on('end', function (data) {
    if (targetPath) {
      var out = fs.createWriteStream(targetPath, { 
          flags: 'w', 
          encoding: 'utf-8', 
          mode: 0644 
      });
      out.write(buffer);
      out.end;
    } else {
      process.stdout.write(buffer);
    }
  });


