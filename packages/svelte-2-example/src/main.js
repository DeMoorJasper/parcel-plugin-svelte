const App = require('./App.svelte');

const app = new App({
  target: document.getElementById('demo'),
  data: {
    name: 'world'
  }
});
