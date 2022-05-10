# tiled-load

This lets you read [tiled](https://www.mapeditor.org/) in javascript. It can handle JSON files, with all the different encoding options (zlib, gzip, base64, etc.)

It's meant to work in browser or node. It just loads the data in a normalized & easy-to-read format, and you can do whatever you want with it.

## usage

There is only one function to use:

```js
import tiled from 'tiled-load'

// give it a filename & prefix (relative location where the map is)
const map = await tiled('demo.tmj', './example/')
```

It has a `loader` (3rd param) that takes a filename, and will resolve it as a text-file. The default for that checks for `fetch` and if not found, uses `readFile`, but you can override that, if you need another behavior.

## installation

There are a lot of ways to use tiled-load. If you are in an environment that can't import npm modules directly (like in a browser) use an [import-map](https://github.com/WICG/import-maps) for `pako` (if you need compression support.) If you need base64 (compressed or uncompressed) you need `atob`, which will be installed in node, and already available in others (browsers, deno, etc.)

### node

```sh
npm i tiled-load
```

Now, you can set `"type": "module"` in `package.json` and do this:

```js
import tiled from 'tiled-load'
```

or commonjs:

```js
const tiled = require('tiled-load')
```

### browser

Use it directly with a CDN & [import-map](https://github.com/WICG/import-maps).

```html
<script type="importmap">
{
  "imports": {
    "pako": "https://unpkg.com/pako@2.0.3/dist/pako.esm.mjs",
    "tiled-load": "https://unpkg.com/tiled-load@latest/dist/tiled-load.modern.js"
  }
}
</script>

<script type="module">
import tiled from 'tiled-load'
</script>
```

You can also do it older-style, if you don't have module-support:

```html
<script src="https://unpkg.com/tiled-load"></script>
<script src="https://unpkg.com/pako@2.0.3/dist/pako.min.js"></script>
```


