const { setupBundler, run } = require('./utils');
const assertBundleTree = require('parcel-assert-bundle-tree');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

describe('styles', function() {
  it('Should create a basic svelte bundle with stylesheets', async function() {
    const bundler = await setupBundler(path.join(__dirname, './Integration/Style/main.js'));
    const bundle = await bundler.bundle();

    assertBundleTree(bundle, {
      name: 'main.js',
      assets: [
        'main.js', 
        'component.svelte',
        'hot-api.js',
        'index.js',
        'proxy.js',
        'registry.js'
      ]
    });

    let bundleContent = await new Promise(resolve => fs.readFile(bundle.name, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    }));
    
    assert(bundleContent.toString().indexOf(', the time is') > 0, 'Should contain the component code');
  });
});