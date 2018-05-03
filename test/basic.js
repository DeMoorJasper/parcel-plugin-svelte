const { setupBundler, assertBundleTree } = require('./utils');
const path = require('path');

describe('basic', function() {
  it('Should create a basic svelte bundle', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/Basic/index.html'));
    const bundle = await bundler.bundle();

    assertBundleTree(bundle, {
      name: 'index.html',
      assets: ['index.html'],
      childBundles: [
        {
          type: 'js',
          assets: ['index.js', 'Demo.svelte', 'Header.svelte'],
          childBundles: [
            {
              type: 'map'
            }
          ]
        }
      ]
    });
  });
});