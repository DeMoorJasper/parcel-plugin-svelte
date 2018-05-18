const { compile, preprocess } = require('svelte');
const { Asset } = require('./ParcelAdapter');
const { sanitize, capitalize } = require('./utils');

class SvelteAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async generate() {
    let compilerOptions = {
      generate: 'dom',
      format: 'cjs',
      store: true,
      css: false
    };
    let preprocessOptions = undefined;

    const fixedCompilerOptions = {
      filename: this.relativeName,
      // the name of the constructor. Required for 'iife' and 'umd' output,
	    // but otherwise mostly useful for debugging. Defaults to 'SvelteComponent'
      name: capitalize(sanitize(this.relativeName)) 
    };

    const customConfig = await this.getConfig(['.svelterc', 'svelte.config.js', 'package.json']);
    if (customConfig) {
      const customOptions = customConfig.svelte || customConfig;
      if (customOptions.preprocess) {
        preprocessOptions = customOptions.preprocess;
      }
      if (customOptions.compilerOptions) {
        Object.keys(customOptions.compilerOptions).forEach(key => {
          if (fixedCompilerOptions[key]) return;
          compilerOptions[key] = customOptions.compilerOptions[key];
        });
      }
    }

    compilerOptions = Object.assign({}, compilerOptions, fixedCompilerOptions);

    if (preprocessOptions) {
      const preprocessed = await preprocess(this.contents, preprocessOptions);
      this.contents = preprocessed.toString();
    }

    let { css, js } = compile(this.contents, compilerOptions);
    let { map,code } = js;
    css = css.code;

    if (this.options.sourceMaps) {
      map.sources = [this.relativeName];
      map.sourcesContent = [this.contents];
    }

    let parts = [
      {
        type: 'js',
        value: code,
        sourceMap: this.options.sourceMaps ? map : undefined
      }
    ];

    if (css) {
      parts.push({
        type: 'css',
        value: css
      });
    }

    return parts;
  }
}

module.exports = SvelteAsset;
