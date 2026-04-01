import type { Anchor } from 'kaplay'

import { THEME } from '../constants'

const BACKDROP_Z = -1000
const FOG_LAYER_Z = -970
const DUST_LAYER_Z = -950
const PANEL_SHADOW_Z = -5

interface DungeonBackdropOptions {
  actionAreaTop?: number
  overlayOpacity?: number
}

interface PanelShadowOptions {
  anchor?: Anchor
  height: number
  offsetX?: number
  offsetY?: number
  opacity?: number
  width: number
  x: number
  y: number
}

export function addDungeonBackdrop(options: DungeonBackdropOptions = {}) {
  const sceneWidth = width()
  const sceneHeight = height()
  const actionAreaTop = options.actionAreaTop ?? Math.round(sceneHeight * 0.42)
  const overlayOpacity = options.overlayOpacity ?? 0
  const windowCenterX = sceneWidth * 0.68
  const windowCenterY = sceneHeight * 0.24

  add([
    rect(sceneWidth, sceneHeight),
    color(...THEME.GAME_BACKGROUND_COLOR),
    pos(0, 0),
    z(BACKDROP_Z),
  ])

  add([
    rect(sceneWidth, actionAreaTop),
    color(...THEME.BACKDROP_HAZE_COLOR),
    opacity(0.62),
    pos(0, 0),
    z(BACKDROP_Z + 1),
  ])

  add([
    rect(sceneWidth, sceneHeight - actionAreaTop),
    color(...THEME.GAME_LOWER_BACKGROUND_COLOR),
    opacity(0.98),
    pos(0, actionAreaTop),
    z(BACKDROP_Z + 1),
  ])

  add([
    circle(220),
    color(...THEME.BACKDROP_MOONLIGHT_COLOR),
    opacity(0.16),
    pos(windowCenterX, windowCenterY),
    anchor('center'),
    z(BACKDROP_Z + 2),
  ])

  add([
    rect(200, 260, { radius: 28 }),
    color(...THEME.BACKDROP_ARCH_COLOR),
    pos(windowCenterX, 32),
    anchor('top'),
    z(BACKDROP_Z + 3),
  ])
  ;[-54, 0, 54].forEach((offsetX) => {
    add([
      rect(10, 236, { radius: 5 }),
      color(...THEME.BACKDROP_MOONLIGHT_COLOR),
      opacity(offsetX === 0 ? 0.2 : 0.12),
      pos(windowCenterX + offsetX, 50),
      anchor('top'),
      z(BACKDROP_Z + 4),
    ])
  })
  ;[90, 150, 210].forEach((offsetY) => {
    add([
      rect(170, 8, { radius: 4 }),
      color(...THEME.BACKDROP_MOONLIGHT_COLOR),
      opacity(0.12),
      pos(windowCenterX, offsetY),
      anchor('center'),
      z(BACKDROP_Z + 4),
    ])
  })

  const columnPositions = [90, 250, sceneWidth - 250, sceneWidth - 90]
  columnPositions.forEach((columnX) => {
    add([
      rect(58, actionAreaTop + 140, { radius: 18 }),
      color(...THEME.BACKDROP_ARCH_COLOR),
      pos(columnX, -20),
      anchor('top'),
      z(BACKDROP_Z + 5),
    ])

    add([
      rect(104, 28, { radius: 14 }),
      color(...THEME.BACKDROP_ARCH_COLOR),
      pos(columnX, actionAreaTop * 0.24),
      anchor('center'),
      z(BACKDROP_Z + 5),
    ])
  })

  const shelfXs = [sceneWidth * 0.18, sceneWidth * 0.38, sceneWidth * 0.84]
  shelfXs.forEach((shelfX, index) => {
    const shelfHeight = 190 + index * 20
    const shelfWidth = index === 1 ? 220 : 180

    add([
      rect(shelfWidth, shelfHeight, { radius: 20 }),
      color(...THEME.BACKDROP_SHELF_COLOR),
      opacity(0.92),
      pos(shelfX, actionAreaTop - 12),
      anchor('bot'),
      z(BACKDROP_Z + 6),
    ])
    ;[52, 102, 152].forEach((shelfOffset) => {
      if (shelfOffset >= shelfHeight - 20) {
        return
      }

      add([
        rect(shelfWidth - 24, 6, { radius: 3 }),
        color(...THEME.BACKDROP_FOG_COLOR),
        opacity(0.08),
        pos(shelfX, actionAreaTop - shelfHeight + shelfOffset),
        anchor('center'),
        z(BACKDROP_Z + 7),
      ])
    })
  })

  add([
    rect(sceneWidth, 120),
    color(...THEME.BACKDROP_FLOOR_GLOW_COLOR),
    opacity(0.18),
    pos(0, actionAreaTop - 10),
    z(BACKDROP_Z + 8),
  ])

  add([
    rect(sceneWidth, 18, { radius: 8 }),
    color(...THEME.BACKDROP_FOG_COLOR),
    opacity(0.16),
    pos(0, actionAreaTop - 8),
    z(BACKDROP_Z + 9),
  ])
  ;[
    { duration: 6.2, width: sceneWidth * 0.72, y: actionAreaTop * 0.24 },
    { duration: 7.4, width: sceneWidth * 0.6, y: actionAreaTop * 0.4 },
  ].forEach((fog, index) => {
    const fogStrip = add([
      rect(fog.width, 64 - index * 10, { radius: 32 }),
      color(...THEME.BACKDROP_FOG_COLOR),
      opacity(0.08 - index * 0.02),
      pos(sceneWidth * 0.18 + index * 80, fog.y),
      z(FOG_LAYER_Z + index),
    ])

    const startX = fogStrip.pos.x
    fogStrip.onUpdate(() => {
      fogStrip.pos.x = startX + Math.sin(time() / fog.duration) * 26
    })
  })
  ;[
    { pulse: 1.8, radius: 170, x: 80, y: actionAreaTop - 28 },
    { pulse: 2.2, radius: 150, x: sceneWidth - 88, y: actionAreaTop - 36 },
  ].forEach((glow, index) => {
    const glowOrb = add([
      circle(glow.radius),
      color(...THEME.BACKDROP_CANDLELIGHT_COLOR),
      opacity(0.075),
      pos(glow.x, glow.y),
      anchor('center'),
      z(FOG_LAYER_Z + 4 + index),
    ])

    const baseOpacity = glowOrb.opacity
    glowOrb.onUpdate(() => {
      glowOrb.opacity = baseOpacity + Math.sin(time() * glow.pulse) * 0.014
    })
  })

  for (let index = 0; index < 14; index += 1) {
    const particle = add([
      circle(rand(1.5, 3.8)),
      color(...THEME.BACKDROP_DUST_COLOR),
      opacity(rand(0.04, 0.14)),
      pos(rand(28, sceneWidth - 28), rand(28, actionAreaTop + 120)),
      z(DUST_LAYER_Z + index),
    ])

    const driftSpeed = rand(5, 12)
    const sway = rand(8, 28)
    const phase = rand(0, Math.PI * 2)

    particle.onUpdate(() => {
      particle.pos.y += driftSpeed * dt()
      particle.pos.x += Math.sin(time() + phase) * sway * dt() * 0.18

      if (particle.pos.y > actionAreaTop + 160) {
        particle.pos.y = rand(-40, 0)
        particle.pos.x = rand(28, sceneWidth - 28)
      }
    })
  }

  add([
    rect(sceneWidth, 120),
    color(...THEME.VIGNETTE_COLOR),
    opacity(0.18 + overlayOpacity),
    pos(0, 0),
    z(FOG_LAYER_Z + 20),
  ])

  add([
    rect(sceneWidth, 200),
    color(...THEME.VIGNETTE_COLOR),
    opacity(0.2 + overlayOpacity),
    pos(0, sceneHeight - 200),
    z(FOG_LAYER_Z + 20),
  ])

  add([
    rect(120, sceneHeight),
    color(...THEME.VIGNETTE_COLOR),
    opacity(0.16 + overlayOpacity),
    pos(0, 0),
    z(FOG_LAYER_Z + 20),
  ])

  add([
    rect(120, sceneHeight),
    color(...THEME.VIGNETTE_COLOR),
    opacity(0.16 + overlayOpacity),
    pos(sceneWidth - 120, 0),
    z(FOG_LAYER_Z + 20),
  ])
}

export function addPanelShadow(options: PanelShadowOptions) {
  const {
    anchor: panelAnchor,
    height,
    offsetX = 0,
    offsetY = 10,
    opacity: shadowOpacity = 0.34,
    width: panelWidth,
    x,
    y,
  } = options

  add([
    rect(panelWidth, height, { radius: 28 }),
    color(...THEME.PANEL_SHADOW_COLOR),
    opacity(shadowOpacity),
    pos(x + offsetX, y + offsetY),
    ...(panelAnchor ? [anchor(panelAnchor)] : []),
    z(PANEL_SHADOW_Z),
  ])
}
