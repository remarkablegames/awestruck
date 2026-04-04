import { LAYER, THEME } from '../constants'
import type { Color } from '../types'

interface BackdropOptions {
  actionAreaTop?: number
  floor?: number
  overlayOpacity?: number
}

interface BackdropPalette {
  backdropArchColor: Color
  backdropCandlelightColor: Color
  backdropDustColor: Color
  backdropFloorGlowColor: Color
  backdropFogColor: Color
  backdropHazeColor: Color
  backdropMoonlightColor: Color
  backdropShelfColor: Color
  gameBackgroundColor: Color
  gameLowerBackgroundColor: Color
}

const DEFAULT_BACKDROP_PALETTE: BackdropPalette = {
  backdropArchColor: THEME.BACKDROP_ARCH_COLOR,
  backdropCandlelightColor: THEME.BACKDROP_CANDLELIGHT_COLOR,
  backdropDustColor: THEME.BACKDROP_DUST_COLOR,
  backdropFloorGlowColor: THEME.BACKDROP_FLOOR_GLOW_COLOR,
  backdropFogColor: THEME.BACKDROP_FOG_COLOR,
  backdropHazeColor: THEME.BACKDROP_HAZE_COLOR,
  backdropMoonlightColor: THEME.BACKDROP_MOONLIGHT_COLOR,
  backdropShelfColor: THEME.BACKDROP_SHELF_COLOR,
  gameBackgroundColor: THEME.GAME_BACKGROUND_COLOR,
  gameLowerBackgroundColor: THEME.GAME_LOWER_BACKGROUND_COLOR,
}

const HIGH_FLOOR_BACKDROP_PALETTE: BackdropPalette = {
  backdropArchColor: [38, 14, 18],
  backdropCandlelightColor: [172, 84, 58],
  backdropDustColor: [210, 166, 166],
  backdropFloorGlowColor: [82, 28, 30],
  backdropFogColor: [96, 42, 48],
  backdropHazeColor: [48, 18, 22],
  backdropMoonlightColor: [138, 62, 68],
  backdropShelfColor: [24, 9, 13],
  gameBackgroundColor: [29, 11, 15],
  gameLowerBackgroundColor: [23, 9, 13],
}

export function getBackdropPalette(floor?: number): BackdropPalette {
  return floor && floor > 4
    ? HIGH_FLOOR_BACKDROP_PALETTE
    : DEFAULT_BACKDROP_PALETTE
}

export function addBackdrop(options: BackdropOptions = {}) {
  const sceneWidth = width()
  const sceneHeight = height()
  const actionAreaTop = options.actionAreaTop ?? Math.round(sceneHeight * 0.42)
  const backdropPalette = getBackdropPalette(options.floor)
  const overlayOpacity = options.overlayOpacity ?? 0
  const windowCenterX = sceneWidth * 0.68
  const windowCenterY = sceneHeight * 0.24

  add([
    rect(sceneWidth, sceneHeight),
    color(backdropPalette.gameBackgroundColor),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(sceneWidth, actionAreaTop),
    color(backdropPalette.backdropHazeColor),
    opacity(0.62),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(sceneWidth, sceneHeight - actionAreaTop),
    color(backdropPalette.gameLowerBackgroundColor),
    opacity(0.98),
    pos(0, actionAreaTop),
    z(LAYER.BACKDROP),
  ])

  add([
    circle(220),
    color(backdropPalette.backdropMoonlightColor),
    opacity(0.16),
    pos(windowCenterX, windowCenterY),
    anchor('center'),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(200, 260, { radius: 28 }),
    color(backdropPalette.backdropArchColor),
    pos(windowCenterX, 32),
    anchor('top'),
    z(LAYER.BACKDROP),
  ])
  ;[-54, 0, 54].forEach((offsetX) => {
    add([
      rect(10, 236, { radius: 5 }),
      color(backdropPalette.backdropMoonlightColor),
      opacity(offsetX === 0 ? 0.2 : 0.12),
      pos(windowCenterX + offsetX, 50),
      anchor('top'),
      z(LAYER.BACKDROP),
    ])
  })
  ;[90, 150, 210].forEach((offsetY) => {
    add([
      rect(170, 8, { radius: 4 }),
      color(backdropPalette.backdropMoonlightColor),
      opacity(0.12),
      pos(windowCenterX, offsetY),
      anchor('center'),
      z(LAYER.BACKDROP),
    ])
  })

  const columnPositions = [90, 250, sceneWidth - 250, sceneWidth - 90]
  columnPositions.forEach((columnX) => {
    add([
      rect(58, actionAreaTop + 140, { radius: 18 }),
      color(backdropPalette.backdropArchColor),
      pos(columnX, -20),
      anchor('top'),
      z(LAYER.BACKDROP),
    ])

    add([
      rect(104, 28, { radius: 14 }),
      color(backdropPalette.backdropArchColor),
      pos(columnX, actionAreaTop * 0.24),
      anchor('center'),
      z(LAYER.BACKDROP),
    ])
  })

  const shelfXs = [sceneWidth * 0.18, sceneWidth * 0.38, sceneWidth * 0.84]
  shelfXs.forEach((shelfX, index) => {
    const shelfHeight = 190 + index * 20
    const shelfWidth = index === 1 ? 220 : 180

    add([
      rect(shelfWidth, shelfHeight, { radius: 20 }),
      color(backdropPalette.backdropShelfColor),
      opacity(0.92),
      pos(shelfX, actionAreaTop - 12),
      anchor('bot'),
      z(LAYER.BACKDROP),
    ])
    ;[52, 102, 152].forEach((shelfOffset) => {
      if (shelfOffset >= shelfHeight - 20) {
        return
      }

      add([
        rect(shelfWidth - 24, 6, { radius: 3 }),
        color(backdropPalette.backdropFogColor),
        opacity(0.08),
        pos(shelfX, actionAreaTop - shelfHeight + shelfOffset),
        anchor('center'),
        z(LAYER.BACKDROP),
      ])
    })
  })

  add([
    rect(sceneWidth, 120),
    color(backdropPalette.backdropFloorGlowColor),
    opacity(0.18),
    pos(0, actionAreaTop - 10),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(sceneWidth, 18, { radius: 8 }),
    color(backdropPalette.backdropFogColor),
    opacity(0.16),
    pos(0, actionAreaTop - 8),
    z(LAYER.BACKDROP),
  ])
  ;[
    { duration: 6.2, width: sceneWidth * 0.72, y: actionAreaTop * 0.24 },
    { duration: 7.4, width: sceneWidth * 0.6, y: actionAreaTop * 0.4 },
  ].forEach((fog, index) => {
    const fogStrip = add([
      rect(fog.width, 64 - index * 10, { radius: 32 }),
      color(backdropPalette.backdropFogColor),
      opacity(0.08 - index * 0.02),
      pos(sceneWidth * 0.18 + index * 80, fog.y),
      z(LAYER.BACKDROP),
    ])

    const startX = fogStrip.pos.x
    fogStrip.onUpdate(() => {
      fogStrip.pos.x = startX + Math.sin(time() / fog.duration) * 26
    })
  })
  ;[
    { pulse: 1.8, radius: 170, x: 80, y: actionAreaTop - 28 },
    { pulse: 2.2, radius: 150, x: sceneWidth - 88, y: actionAreaTop - 36 },
  ].forEach((glow) => {
    const glowOrb = add([
      circle(glow.radius),
      color(backdropPalette.backdropCandlelightColor),
      opacity(0.075),
      pos(glow.x, glow.y),
      anchor('center'),
      z(LAYER.BACKDROP),
    ])

    const baseOpacity = glowOrb.opacity
    glowOrb.onUpdate(() => {
      glowOrb.opacity = baseOpacity + Math.sin(time() * glow.pulse) * 0.014
    })
  })

  for (let index = 0; index < 24; index += 1) {
    const particle = add([
      circle(rand(2.5, 5.2)),
      color(backdropPalette.backdropDustColor),
      opacity(rand(0.12, 0.28)),
      pos(rand(28, sceneWidth - 28), rand(18, actionAreaTop + 80)),
      z(LAYER.BACKDROP),
    ])

    const driftSpeed = rand(8, 18)
    const sway = rand(12, 36)
    const phase = rand(0, Math.PI * 2)

    particle.onUpdate(() => {
      particle.pos.y += driftSpeed * dt()
      particle.pos.x += Math.sin(time() * 0.9 + phase) * sway * dt() * 0.24

      if (particle.pos.y > actionAreaTop + 120) {
        particle.pos.y = rand(-40, 0)
        particle.pos.x = rand(28, sceneWidth - 28)
      }
    })
  }

  add([
    rect(sceneWidth, 120),
    color(THEME.VIGNETTE_COLOR),
    opacity(0.18 + overlayOpacity),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(sceneWidth, 200),
    color(THEME.VIGNETTE_COLOR),
    opacity(0.2 + overlayOpacity),
    pos(0, sceneHeight - 200),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(120, sceneHeight),
    color(THEME.VIGNETTE_COLOR),
    opacity(0.16 + overlayOpacity),
    z(LAYER.BACKDROP),
  ])

  add([
    rect(120, sceneHeight),
    color(THEME.VIGNETTE_COLOR),
    opacity(0.16 + overlayOpacity),
    pos(sceneWidth - 120, 0),
    z(LAYER.BACKDROP),
  ])
}
