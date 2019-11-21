const path = require('path');

function generateName(input) {
  let name = path
    .basename(input)
    .replace(path.extname(input), '')
    .replace(/[^a-zA-Z_$0-9]+/g, '_')
    .replace(/^_/, '')
    .replace(/_$/, '')
    .replace(/^(\d)/, '_$1');

  name = name[0].toUpperCase() + name.slice(1);
  return name;
}

function makeHot(id, code, asset) {
  const hotApiRequire = path.relative(path.dirname(asset.name), require.resolve('./hot-api')).replace(/\\/g, '/');

  const replacement = `
    if (module.hot) {
      const { configure, register, reload } = require('${hotApiRequire}');

      module.hot.accept();

      if (!module.hot.data) {
        // initial load
        configure({});
        $3 = register('${id}', $3);
      } else {
        // hot update
        $3 = reload('${id}', $3);
      }
    }

    module.exports = $3;
  `;

  return code.replace(/((module.exports =|export default) ([^;]*));/, replacement);
}

// Parcel can be added as a dependency by using two different
// names. This is how we get the right one.
function getAssetClass() {
  try {
    return require('parcel').Asset;
  } catch (e) {
    return require('parcel-bundler').Asset;
  }
}

module.exports = {
  generateName,
  makeHot,
  Asset: getAssetClass()
}
