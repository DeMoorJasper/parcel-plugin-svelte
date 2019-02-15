module.exports = function(bundler) {
  bundler.addAssetType('svelte', require.resolve('./svelte-asset.js'));
};
