const path = require('path');

function sanitize(input) {
  return path
    .basename(input)
    .replace(path.extname(input), '')
    .replace(/[^a-zA-Z_$0-9]+/g, '_')
    .replace(/^_/, '')
    .replace(/_$/, '')
    .replace(/^(\d)/, '_$1');
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

exports.sanitize = sanitize;
exports.capitalize = capitalize;
