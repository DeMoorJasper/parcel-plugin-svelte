const { compile, preprocess } = require('svelte');
const { Asset } = require('parcel-bundler');

class SvelteAsset extends JSAsset {
  async parse(inputCode) {
    let svelteOptions = {
      compilerOptions: {
        generate: 'dom',
        format: 'cjs',
        store: true,
        filename: this.relativeName,
        css: false
      },
      preprocess: undefined
    };

    const customConfig = await this.getConfig(['.svelterc', 'svelte.config.js', 'package.json']);
    if (customConfig) {
      svelteOptions = Object.assign(svelteOptions, customConfig.svelte || customConfig);
    }

    if (svelteOptions.preprocess) {
      const preprocessed = await preprocess(inputCode, svelteOptions.preprocess);
      inputCode = preprocessed.toString();
    }

    return compile(inputCode, svelteOptions.compilerOptions);
    
    this.contents = code;
    if (this.options.sourceMaps) {
      map.sources = [this.relativeName];
      map.sourcesContent = [this.contents];
      this.sourceMap = map;
    }

    return super.parse(this.contents);
  }

  async generate() {
    const { code, map, ast, css, cssMap } = this.ast;

    if (this.options.sourceMaps) {
      map.sources = [this.relativeName];
      map.sourcesContent = [this.contents];
    }

    let parts = [
      {
        type: 'js',
        value: code,
        sourceMap: this.options.sourceMaps ? map : null
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
