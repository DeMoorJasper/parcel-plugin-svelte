const { compile, preprocess } = require('svelte');

// Parcel requires
const parcelRequire = require('./parcelRequire');
const JSAsset = require(parcelRequire.JSAsset);

class SvelteAsset extends JSAsset {
  async parse(inputCode) {
    let svelteOptions = {
      compilerOptions: {
        generate: 'dom',
        format: 'cjs',
        store: true,
        filename: this.relativeName
      },
      preprocess: undefined
    };

    const customConfig = await this.getConfig(['.svelterc', 'svelte.config.js']);
    if (customConfig) {
      svelteOptions = Object.assign(svelteOptions, customConfig);
    }

    if (svelteOptions.preprocess) {
      const preprocessed = await preprocess(inputCode, svelteOptions.preprocess);
      inputCode = preprocessed.toString();
    }

    const { code, map, ast, css } = compile(inputCode, svelteOptions.compilerOptions);
    this.contents = code;
    if (this.options.sourceMaps) {
      map.sources = [this.relativeName];
      map.sourcesContent = [this.contents];
      this.sourceMap = map;
    }

    return super.parse(this.contents);
  }
}

module.exports = SvelteAsset;