const { compile } = require('svelte');
const JSAsset = require('parcel-bundler/src/assets/JSAsset');

class SvelteAsset extends JSAsset {
  parse(code) {
    const svelteOptions = {
      generate: 'dom',
      format: 'cjs'
    };

    const compiled = compile(code, svelteOptions);
    this.contents = compiled.code;
    super.parse(this.contents);
  }
}

module.exports = SvelteAsset;