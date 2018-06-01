const { compile, preprocess } = require('svelte');
const { Asset } = require('./ParcelAdapter');
const { sanitize, capitalize } = require('./utils');

function makeHot(id, code) {
  const replacement = `
if (module.hot) {
  const { configure, register, reload } = require('parcel-plugin-svelte/lib/hot-api');

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

    let customConfig = (await this.getConfig(['.svelterc', 'svelte.config.js', 'package.json'])) || {};
    customConfig = customConfig.svelte || customConfig;
    if (customConfig.preprocess) {
      preprocessOptions = customConfig.preprocess;
    }

    compilerOptions = Object.assign(compilerOptions, customConfig.compilerOptions || {}, fixedCompilerOptions);

    if (preprocessOptions) {
      const preprocessed = await preprocess(this.contents, preprocessOptions);
      this.contents = preprocessed.toString();
    }

    let { css, js } = compile(this.contents, compilerOptions);
    let { map,code } = js;

    if (process.env.NODE_ENV !== 'production') {
      code = makeHot(fixedCompilerOptions.filename, code);
    }

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

  async postProcess(generated) {
    // Hacky fix to remove duplicate JS asset (Css HMR code)
    let filteredArr = generated.filter(part => part.type !== 'js');
    return [generated[0]].concat(filteredArr);
  }
}

module.exports = SvelteAsset;
