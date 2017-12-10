const Demo = require('./Demo.svelte')

const demo = new Demo({
  target: document.getElementById('demo'),
  data: { name: 'world' }
});

// demo.set({ name: 'everybody' });