const { setupBundler, run } = require('./utils');
const assertBundleTree = require('parcel-assert-bundle-tree');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

describe('with config', function() {
  it('Should create a basic svelte bundle with config files', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/WithConfig/run.js'));
    const bundle = await bundler.bundle();

    assertBundleTree(bundle, {
      type: 'js',
      assets: ['run.js', 'AppWithConfig.svelte'],
      childBundles: [
        {
          type: 'map'
        }
      ]
    });

    let file = fs.readFileSync(__dirname + '/dist/run.js', 'utf8');
    assert(file.includes('function AppWithConfig'));
    assert(file.indexOf('__REPLACE_ME__') === -1);
    assert(file.indexOf('Hello world') !== -1);
  });
});
