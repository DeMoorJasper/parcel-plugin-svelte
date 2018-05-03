const Bundler = require('parcel-bundler');
const path = require('path');
const SveltePlugin = require('../src/index');

async function setupBundler(input, options) {
  const bundler = new Bundler(input, Object.assign({
    outDir: path.join(__dirname, 'dist'),
    watch: false,
    cache: false,
    hmr: false,
    logLevel: 0
  }, options));
  await SveltePlugin(bundler);
  return bundler;
}

exports.setupBundler = setupBundler;