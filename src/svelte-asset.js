const path = require('path');

const { version } = require('svelte/package.json');
const major_version = +version[0];

const { compile, preprocess } = major_version >= 3 ? require('svelte/compiler.js') : require('svelte');

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
        $2 = register('${id}', $2);
      } else {
        // hot update
        $2 = reload('${id}', $2);
      }
    }

    module.exports = $2;
  `;

  return code.replace(/(module.exports = ([^;]*));/, replacement);
}

class SvelteAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async getConfig() {
    let config = (await super.getConfig(['.svelterc', 'svelte.config.js', 'package.json'])) || {};
    config = config.svelte || config;

    let defaultOptions = {
      generate: 'dom',
      store: true,
      css: true,
      format: 'cjs'
    };

    let customCompilerOptions = config.compilerOptions || {};

    let fixedCompilerOptions = {
      filename: this.relativeName,
      // The name of the constructor. Required for 'iife' and 'umd' output,
      // but otherwise mostly useful for debugging. Defaults to 'SvelteComponent'
      name: capitalize(sanitize(this.relativeName)),
      shared: customCompilerOptions.shared || major_version >= 3 ? 'svelte/internal.js' : 'svelte/shared.js'
    };

    config.compilerOptions = Object.assign({}, defaultOptions, customCompilerOptions, fixedCompilerOptions);

    return config;
  }

  async generate() {
    let config = await this.getConfig();
    let compilerOptions = config.compilerOptions;

    if (config.preprocess) {
      const preprocessed = await preprocess(this.contents, config.preprocess);
      this.contents = preprocessed.toString();
    }

    let { css, js } = compile(this.contents, compilerOptions);
    let { map, code } = js;

    if (process.env.NODE_ENV !== 'production') {
      code = makeHot(compilerOptions.filename, code, this);
    }

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
