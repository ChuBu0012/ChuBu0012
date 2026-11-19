import test from 'node:test'
import assert from 'node:assert/strict'
import { resolvePortraitState } from './portraitState.js'

test('shows the default portrait when there is no interaction', () => {
  assert.equal(resolvePortraitState({ hovered: false, waving: false }), 'default')
})

test('shows the tilted portrait while hovered', () => {
  assert.equal(resolvePortraitState({ hovered: true, waving: false }), 'hover')
})

test('wave state takes priority over hover', () => {
  assert.equal(resolvePortraitState({ hovered: true, waving: true }), 'wave')
})

test('returns to hover or default after waving based on pointer position', () => {
  assert.equal(resolvePortraitState({ hovered: true, waving: false }), 'hover')
  assert.equal(resolvePortraitState({ hovered: false, waving: false }), 'default')
})
