# parcel-plugin-svelte
A parcel plugin that enables svelte support [[CHANGELOG]](https://github.com/DeMoorJasper/parcel-plugin-svelte/blob/master/CHANGELOG.md)

### Currently only .svelte imports are supported, look at the [example](https://github.com/DeMoorJasper/parcel-plugin-svelte/tree/master/example) for details

## Installation
```bash
yarn add parcel-plugin-svelte -D
```
or
```bash
npm install parcel-plugin-svelte -D
```

## Configuration
The default configuration should work for most people but I added the possibility to define your own config values any of through `svelte.config.js`(preferred method), `.svelterc`, or `svlete` field in `package.json`, for documentation on which parameters u can set and use look at the official [svelte docs](https://github.com/sveltejs/svelte)
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

## Development/Contribution
### Running the example
```bash
npm run example
```

## License
MIT License
