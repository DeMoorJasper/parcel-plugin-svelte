const path = require('path');
const { compile, preprocess } = require('svelte/compiler.js');
const { Asset } = require('./parcel-adapter');
const { sanitize, capitalize } = require('./utils');

function makeHot(id, code, asset) {
  const hotApiRequire = path.relative(path.dirname(asset.name), require.resolve('./hot-api')).replace(/\\/g, '/');

  const replacement = `
    if (module.hot) {
      const { configure, register, reload } = require('${hotApiRequire}');

      module.hot.accept();

      if (!module.hot.data) {
        // initial load
        configure({});
        $3 = register('${id}', $3);
      } else {
        // hot update
        $3 = reload('${id}', $3);
      }
    }

    module.exports = $3;
  `;

  return code.replace(/((module.exports =|export default) ([^;]*));/, replacement);
}

class SvelteAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async getConfig() {
    let config = (await super.getConfig(['.svelterc', 'svelte.config.js', 'package.json'])) || {};
    config = config.svelte || config;

    // If somebody use svelte field as a path to unprocessed sources
    // @see https://github.com/rollup/rollup-plugin-svelte#pkgsvelte
    if (config == null || typeof config !== 'object') {
      config = {};
    }

    let defaultOptions = {
      generate: 'dom',
      css: true
    };

    let customCompilerOptions = config.compilerOptions || {};

    defaultOptions.format = 'esm';
    defaultOptions.sveltePath = 'svelte';

    let fixedCompilerOptions = {
      filename: this.relativeName,
      // The name of the constructor. Required for 'iife' and 'umd' output,
      // but otherwise mostly useful for debugging. Defaults to 'SvelteComponent'
      name: capitalize(sanitize(this.relativeName))
    };

    config.compilerOptions = Object.assign({}, defaultOptions, customCompilerOptions, fixedCompilerOptions);

    return config;
  }

  async generate() {
    let config = await this.getConfig();
    let compilerOptions = config.compilerOptions;

    if (config.preprocess) {
      const preprocessed = await preprocess(this.contents, config.preprocess, config.compilerOptions);
      this.contents = preprocessed.toString();
    }

    let { css, js } = compile(this.contents, compilerOptions);
    let { map, code } = js;

    // TODO: Enable HMR if svelte 3 is supported properly
    /*if (this.options.hmr) {
      code = makeHot(compilerOptions.filename, code, this);
    }*/

    css = css.code;

    if (this.options.sourceMaps) {
      map.sources = [this.relativeName];
      map.sourcesContent = [this.contents];
    }

    const parts = [
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

  async postProcess(generated) {
    // Hacky fix to remove duplicate JS asset (Css HMR code)
    const filteredArr = generated.filter(part => part.type !== 'js');
    return [generated[0]].concat(filteredArr);
  }
}

module.exports = SvelteAsset;