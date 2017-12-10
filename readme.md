# parcel-plugin-svelte
A parcel plugin that enables svelte support

## TO-DO
* Fix bug causing Svelte component to get added every time hmr pushes update
* Fix bug development server not showing Svelte component at first load


## Known Parcel bugs that disallow this from working in production
* [Circular Require in Asset.js PR/#165](https://github.com/parcel-bundler/parcel/pull/165)
* [Package.json not found PR/#170](https://github.com/parcel-bundler/parcel/pull/170)
* [No html bundle loader ISSUE/#178](https://github.com/parcel-bundler/parcel/issues/178)

## License
MIT License