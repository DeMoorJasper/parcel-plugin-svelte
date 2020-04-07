# parcel-plugin-svelte

[![Build Status](https://dev.azure.com/DeMoorJasper/parcel-plugin-svelte/_apis/build/status/DeMoorJasper.parcel-plugin-svelte?branchName=master)](https://dev.azure.com/DeMoorJasper/parcel-plugin-svelte/_build/latest?definitionId=3&branchName=master)

A parcel plugin that enables svelte support

## Getting Started

### Install dependencies

```bash
yarn add parcel-bundler parcel-plugin-svelte @babel/polyfill -D
```

### Update the package.json

Update your `package.json` to contain these scripts (for more information on these commands, see: https://parceljs.org/cli.html):

```json
{
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  }
}
```

### Create the files

Create an html file that will be used as the entrypoint, name it `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Parcel Plugin Svelte Example</title>
  </head>
  <body>
    <div id="demo"></div>

    <!-- This script tag points to the source of the JS file we want to load and bundle -->
    <script src="main.js"></script>
  </body>
</html>
```

Create a simple JavaScript file named `main.js`:

```Javascript
import '@babel/polyfill';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('demo'),
  data: {
    name: 'world'
  }
});
```

Create a Svelte file named `App.svelte`:

```svelte
<p>
  Hello { name }, the time is <span class="the-time">{ hours }:{ minutes }:{ seconds }</span>
</p>

<style>
  .the-time {
    font-weight: bold;
  }
</style>

<script>
  import { onMount } from 'svelte';

  export let name = 'Anonymous';
  let time = new Date();

  onMount(() => {
    const timer = setInterval(() => {
      time = new Date();
    }, 1000)

    return () => {
      clearInterval(timer);
    }
  })

  let hours, minutes, seconds;

  $: {
    hours = time.getHours();
    minutes = time.getMinutes();
    seconds = time.getSeconds();
  }
</script>
```

### Further reading

To continue your journey into Svelte and Parcel please have a look at their documentation:

- https://svelte.dev/
- https://parceljs.org/

for configuring this plugin, please read [#Configuration](https://github.com/DeMoorJasper/parcel-plugin-svelte#Configuration)

## Configuration

The default configuration should work for most people but for anyone who would like to change the way svelte compiles the files there is the possibility to configure it.

This can be done though a `svelte.config.js` file, `.svelterc` file or `svelte` field in `package.json`.

For documentation on which parameters you can set and use look at the official [svelte docs](https://svelte.dev/docs#svelte_compile).

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

## Any more questions?

Any more questions about how the plugin works internally or how to use it? Feel free to open an issue in the repository.

## License

This project is licensed under the MIT License
