const path = require('path');
const sourceLocation = parseInt(process.versions.node, 10) >= 8 ? 'parcel-bundler/src/' : 'parcel-bundler/lib/';

module.exports = {
  Asset: path.join(sourceLocation, 'Asset'),
  CSSAsset: path.join(sourceLocation, 'assets/CSSAsset'),
  JSAsset: path.join(sourceLocation, 'assets/JSAsset')
}