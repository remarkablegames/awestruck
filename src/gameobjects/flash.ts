import { LAYER } from '../constants'

const FLASH_DURATION = 0.18
const FLASH_FADE_DURATION = 0.22
const FLASH_OVERLAY_OPACITY = 0.14
const FLASH_TOP_OPACITY = 0.22

export function addFlash() {
  const overlay = add([
    rect(width(), height()),
    color(255, 134, 118),
    opacity(0),
    pos(0, 0),
    z(LAYER.FLASH),
  ])

  const topOverlay = add([
    rect(width(), height() * 0.48),
    color(255, 148, 126),
    opacity(0),
    pos(0, 0),
    z(LAYER.FLASH),
  ])

  return {
    play() {
      overlay.opacity = FLASH_OVERLAY_OPACITY
      topOverlay.opacity = FLASH_TOP_OPACITY

      tween(
        FLASH_OVERLAY_OPACITY,
        0,
        FLASH_DURATION + FLASH_FADE_DURATION,
        (value) => {
          overlay.opacity = value
        },
        easings.easeOutCubic,
      )

      tween(
        FLASH_TOP_OPACITY,
        0,
        FLASH_DURATION + FLASH_FADE_DURATION,
        (value) => {
          topOverlay.opacity = value
        },
        easings.easeOutCubic,
      )
    },
  }
}
