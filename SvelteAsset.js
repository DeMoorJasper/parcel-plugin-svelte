const { compile } = require('svelte');
const JSAsset = require('parcel-bundler/src/assets/JSAsset');

class SvelteAsset extends JSAsset {
  async parse(code) {
    const svelteOptions = {
      generate: 'dom',
      format: 'cjs',
      store: true
    };

    const compiled = compile(code, svelteOptions);
    this.contents = compiled.code;

    return super.parse(this.contents);
  }
}

module.exports = SvelteAsset;