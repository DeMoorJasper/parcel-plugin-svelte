import { Registry, configure as configureProxy, createProxy } from 'svelte-dev-helper';

let hotOptions = {
  noPreserveState: false
};

export function configure(options) {
  hotOptions = Object.assign(hotOptions, options);
  configureProxy(hotOptions);
}

export function register(id, component) {
  // Store original component in registry
  Registry.set(id, {
    rollback: null,
    component,
    instances: []
  });

  // Create the proxy itself
  const proxy = createProxy(id);

  // Patch the registry record with proxy constructor
  const record = Registry.get(id);
  record.proxy = proxy;
  Registry.set(id, record);

  return proxy;
}

export function reload(id, component) {
  const record = Registry.get(id);

  // Keep reference to previous version to enable rollback
  record.rollback = record.component;

  // Replace component in registry with newly loaded component
  record.component = component;

  Registry.set(id, record);

  // Re-render the proxy instances
  record.instances.slice().forEach(instance => instance && instance._rerender());

  // Return the original proxy constructor that was `register()`-ed
  return record.proxy;
}
