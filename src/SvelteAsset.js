const { compile, preprocess } = require('svelte');

// Parcel requires
const parcelRequire = require('./parcelRequire');
const Asset = require(parcelRequire.Asset);
const CSSAsset = require(parcelRequire.CSSAsset);
const JSAsset = require(parcelRequire.JSAsset);

class SvelteAsset extends Asset {
  constructor() {
    super(...arguments);
    this.css = new CSSAsset(...arguments);
    this.js = new JSAsset(...arguments);
    this.type = 'js';
  }

  shouldInvalidate() {
    return (this.ast && this.ast.css && this.css.shouldInvalidate()) || this.js.shouldInvalidate();
  }

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

    const customConfig = await this.getConfig(['.svelterc', 'svelte.config.js', 'package.json']);
    if (customConfig) {
      svelteOptions = Object.assign(svelteOptions, customConfig.svelte || customConfig);
    }

    if (svelteOptions.preprocess) {
      const preprocessed = await preprocess(inputCode, svelteOptions.preprocess);
      inputCode = preprocessed.toString();
    }

    const { code, map, ast, css, cssMap } = compile(inputCode, svelteOptions.compilerOptions);
    this.js.contents = code;
    if (this.js.options.sourceMaps) {
      map.sources = [this.js.relativeName];
      map.sourcesContent = [this.js.contents];
      this.js.sourceMap = map;
    }

    if (css && svelteOptions.compilerOptions.css === false) {
      this.css.contents = css;
      if (this.css.options.sourceMaps) {
        map.sources = [this.css.relativeName];
        map.sourcesContent = [this.css.contents];
        this.css.sourceMap = cssMap;
      }
    }

    const [cssAst, jsAst] = await Promise.all([
      css && svelteOptions.compilerOptions.css === false && this.css.parse(this.css.contents),
      this.js.parse(this.js.contents),
    ]);

    if (cssAst) {
      this.css.ast = cssAst;
    }

    this.js.ast = jsAst;

    return { css: cssAst, js: jsAst };
  }

  async pretransform() {
    await Promise.all([
      this.css.pretransform(),
      this.js.pretransform()
    ]);
  }

  collectDependencies() {
    if (this.ast.css) {
      this.css.collectDependencies();
    }

    this.js.collectDependencies();
  }

  async transform() {
    await Promise.all([
      this.css.transform(),
      this.js.transform()
    ]);
  }

  async generate() {
    if (this.ast.css) {
      const [css, js] = await Promise.all([
        this.css.generate(),
        this.js.generate()
      ]);

      for (const [name, opts] of this.css.dependencies) {
        this.addDependency(name, opts);
      }

      for (const [name, opts] of this.js.dependencies) {
        this.addDependency(name, opts);
      }

      return {
        css: css.css,
        js: css.js ? js.js + `;(function(){${css.js}})()` : js.js,
        map: js.map
      };
    }

    for (const [name, opts] of this.js.dependencies) {
      this.addDependency(name, opts);
    }

    return this.js.generate();
  }

  invalidate() {
    if (this.ast && this.ast.css) {
      this.css.invalidate();
    }

    this.js.invalidate();
    super.invalidate();
  }
}

module.exports = SvelteAsset;
