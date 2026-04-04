import type { GameObj } from 'kaplay'

import { LAYER } from '../constants'
import type { Color } from '../types'

const FLASH_DURATION = 0.18
const FLASH_FADE_DURATION = 0.22
const FLASH_OPACITY = 0.18

interface FlashOptions {
  color?: Color
  height?: number
  opacity?: number
  parent?: GameObj
  width?: number
  x?: number
  y?: number
}

export function addFlash({
  color: flashColor = [255, 255, 255],
  height: flashHeight = height(),
  opacity: flashOpacity = FLASH_OPACITY,
  parent,
  width: flashWidth = width(),
  x = 0,
  y = 0,
}: FlashOptions = {}) {
  const addTo = parent ? parent.add.bind(parent) : add

  const overlay = addTo([
    rect(flashWidth, flashHeight, { radius: 18 }),
    color(flashColor),
    opacity(0),
    pos(x, y),
    ...(parent ? [] : [z(LAYER.FLASH)]),
  ])

  return {
    play() {
      overlay.opacity = flashOpacity

      tween(
        flashOpacity,
        0,
        FLASH_DURATION + FLASH_FADE_DURATION,
        (value) => {
          overlay.opacity = value
        },
        easings.easeOutCubic,
      )
    },
  }
}
