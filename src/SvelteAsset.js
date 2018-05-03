const { compile, preprocess } = require('svelte');
const { Asset } = require('parcel-bundler');

class SvelteAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async generate() {
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
      const preprocessed = await preprocess(this.contents, svelteOptions.preprocess);
      this.contents = preprocessed.toString();
    }

    let { css, js } = compile(this.contents, svelteOptions.compilerOptions);
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
