const { setupBundler, run } = require('./utils');
const assertBundleTree = require('parcel-assert-bundle-tree');
const path = require('path');

describe('styles', function() {
  it('Should create a basic svelte bundle with stylesheets', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/Style/main.js'));
    const bundle = await bundler.bundle();

    assertBundleTree(bundle, {
      name: 'main.js',
      assets: ['main.js', 'component.svelte']
    });
  });
});