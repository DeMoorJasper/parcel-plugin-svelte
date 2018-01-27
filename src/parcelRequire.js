const path = require('path');
const sourceLocation = parseInt(process.versions.node, 10) >= 8 ? 'parcel-bundler/src/' : 'parcel-bundler/lib/';

module.exports = {
  JSAsset: path.join(sourceLocation, 'assets/JSAsset')
}