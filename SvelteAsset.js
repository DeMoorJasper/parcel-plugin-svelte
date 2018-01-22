const config = require('parcel-bundler/src/utils/config');
const { compile, preprocess } = require('svelte');
const JSAsset = require('parcel-bundler/src/assets/JSAsset');

class SvelteAsset extends JSAsset {
  // Used to be compatible with older parcel versions
  async getConfig(filenames) {
    if (super.getConfig) {
      return await super.getConfig(filenames);
    }
    
    let conf = await config.resolve(this.name, filenames);
    if (conf) {
      return await config.load(this.name, filenames);
    }
    return null;
  }

  async parse(inputCode) {
    let svelteOptions = {
      compilerOptions: {
        generate: 'dom',
        format: 'cjs',
        store: true
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

    return super.parse(this.contents);
  }
}

module.exports = SvelteAsset;