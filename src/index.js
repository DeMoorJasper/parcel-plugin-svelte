module.exports = function (bundler) {
    // bundler.addAssetType('html', require.resolve('./SvelteAsset'));
    bundler.addAssetType('svelte', require.resolve('./SvelteAsset'));
};