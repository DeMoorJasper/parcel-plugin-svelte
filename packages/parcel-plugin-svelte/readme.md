# parcel-plugin-svelte

[![Build Status](https://dev.azure.com/DeMoorJasper/parcel-plugin-svelte/_apis/build/status/DeMoorJasper.parcel-plugin-svelte?branchName=master)](https://dev.azure.com/DeMoorJasper/parcel-plugin-svelte/_build/latest?definitionId=3&branchName=master)

A parcel plugin that enables svelte support [[CHANGELOG]](https://github.com/DeMoorJasper/parcel-plugin-svelte/blob/master/CHANGELOG.md)

## Installation

```bash
yarn add parcel-plugin-svelte -D
```

or

```bash
npm install parcel-plugin-svelte -D
```

## Configuration

The default configuration should work for most people but for anyone who would like to change the way svelte compiles the files there is the possibility to configure it.

This can be done though a `svelte.config.js` file, `.svelterc` file or `svelte` field in `package.json`.

For documentation on which parameters you can set and use look at the official [svelte docs](https://github.com/sveltejs/svelte).

```Javascript
// Used by svelte.compile
compiler: {
  ...
},
// Used by svelte.preprocess
preprocess: {
  ...
}
```

**_Note: the use of `compilerOptions` property will be deprecated on the next major version, you should use the`compiler` property instead._**

### CSS CompilerOptions

If you set `compiler.css` to `false`, CSS will be bundled in a separate file. It also enables post-transformations provided by Parcel such as PostCSS and file resolution for `url()`.

## How does it work?

If you want to know how it works have a look at [my article](https://medium.com/@jasperdemoor/writing-a-parcel-plugin-3936271cbaaa) about this plugin, might help if you wanna fix a bug or write your own parcel-plugin.

## License

MIT License
