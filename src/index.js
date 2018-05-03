module.exports = function (bundler) {
    bundler.addAssetType('svelte', require.resolve('./SvelteAsset'));
};
