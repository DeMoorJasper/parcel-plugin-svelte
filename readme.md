# parcel-plugin-svelte

[![Travis CI](https://travis-ci.org/DeMoorJasper/parcel-plugin-svelte.svg?branch=master)](https://travis-ci.org/DeMoorJasper/parcel-plugin-svelte)

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

The default configuration should work for most people but I added the possibility to define your own config values any of through `svelte.config.js`(preferred method), `.svelterc`, or `svelte` field in `package.json`, for documentation on which parameters u can set and use look at the official [svelte docs](https://github.com/sveltejs/svelte)

```Javascript
// Used by svelte.compile
compilerOptions: {
  ...
},
// Used by svelte.preprocess
preprocess: {
  ...
}
```

### `compilerOptions.css`

If you set `compilerOptions.css` `false`, CSS will be bundled in a separate
file. It also enables post-transformations provided by Parcel such as PostCSS
and file resolution for `url()`.

## License

MIT License
