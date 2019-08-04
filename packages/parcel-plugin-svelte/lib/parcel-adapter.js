function parcelExport() {
  try {
    return require('parcel');
  } catch (e) {
    return require('parcel-bundler');
  }
}

module.exports = parcelExport();
