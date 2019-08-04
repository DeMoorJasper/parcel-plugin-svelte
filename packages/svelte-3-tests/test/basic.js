const { setupBundler, run } = require('./utils');
const assertBundleTree = require('parcel-assert-bundle-tree');
const path = require('path');

describe('basic', function() {
  it('Should create a basic svelte bundle', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/Basic/App.svelte'));
    const bundle = await bundler.bundle();

    // , 'internal.mjs'
    assertBundleTree(bundle, {
      type: 'js',
      assets: ['App.svelte', 'index.mjs']
    });
  });
});
