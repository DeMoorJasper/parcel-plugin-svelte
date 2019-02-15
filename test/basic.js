const { setupBundler, run } = require('./utils');
const assertBundleTree = require('parcel-assert-bundle-tree');
const path = require('path');

describe('basic', function() {
  it('Should create a basic svelte bundle', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/Basic/index.js'));
    const bundle = await bundler.bundle();

    assertBundleTree(bundle, {
      type: 'js',
      assets: ['index.js', 'Demo.svelte', 'Header.svelte', 'hot-api.js', 'index.js', 'proxy.js', 'registry.js'],
      childBundles: [
        {
          type: 'map'
        }
      ]
    });
  });

  // Not sure if we can will be able to run this test
  it.skip('Should support Svelte 3 features', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/V3-Example/App.svelte'));
    const bundle = await bundler.bundle();
  });
});
