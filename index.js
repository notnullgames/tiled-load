// decode data in Tiled base64 format
function base64Decode (data) {
  const len = data.length
  const bytes = new Array(len / 4)

  // Interpret data as an array of bytes representing little-endian encoded uint32 values.
  for (let i = 0; i < len; i += 4) {
    bytes[i / 4] = (
      data.charCodeAt(i) |
            data.charCodeAt(i + 1) << 8 |
            data.charCodeAt(i + 2) << 16 |
            data.charCodeAt(i + 3) << 24
    ) >>> 0
  }

  return bytes
}

// support loading external text file in a couple ways, based on availability of global fetch
async function defaultLoader (filename) {
  if (typeof globalThis.fetch !== 'undefined') {
    return globalThis.fetch(filename).then(r => r.text())
  } else {
    const fs = await import('fs/promises')
    return (await fs.readFile(filename)).toString()
  }
}

// load a map
export default async function loadMap (mapFilename, prefix = '', loader = defaultLoader) {
  // TODO: catch error & try XML parsing
  const map = JSON.parse(await loader(`${prefix}${mapFilename}`))

  // resolve all external tilesets & inline
  for (const t in map.tilesets) {
    if (map.tilesets[t].source) {
      map.tilesets[t] = { ...map.tilesets[t], ...JSON.parse(await loader(prefix + map.tilesets[t].source)) }
    }

    // resolve all paths for images
    map.tilesets[t].image = prefix + map.tilesets[t].image
  }

  for (const l in map.layers) {
    // decode layers
    if (map.layers[l].encoding === 'base64') {
      if (typeof globalThis.atob === 'undefined') {
        globalThis.atob = (await import('atob')).default
      }
      if (!map.layers[l].compression || map.layers[l].compression === '') {
        map.layers[l].data = base64Decode(globalThis.atob(map.layers[l].data))
      } else {
        if (typeof globalThis.pako === 'undefined') {
          globalThis.pako = await import('pako')
        }
        const d = Uint8Array.from(globalThis.atob(map.layers[l].data).split('').map(c => c.charCodeAt(0)))
        map.layers[l].data = base64Decode(String.fromCharCode(...globalThis.pako.inflate(d)))
      }
    }
  }

  return map
}
