/* global describe, test, expect */

import { jest } from '@jest/globals'
import tiled from './index.js'

describe('tiled-load', () => {
  test('loadMap, inline tilesets (readFile)', async () => {
    expect(await tiled('demo_inline.tmj', './doc/')).toMatchSnapshot()
  })

  test('loadMap, external tilesets (readFile)', async () => {
    expect(await tiled('demo.tmj', './doc/')).toMatchSnapshot()
  })

  test('loadMap, inline tilesets (fetch)', async () => {
    globalThis.fetch = jest.fn(async () => ({ async text () { return '{}' } }))
    expect(await tiled('demo_inline.tmj', './doc/')).toMatchSnapshot()
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  test('loadMap, external tilesets (fetch)', async () => {
    globalThis.fetch = jest.fn(async () => ({ async text () { return '{}' } }))
    expect(await tiled('demo.tmj', './doc/')).toMatchSnapshot()
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })
})
