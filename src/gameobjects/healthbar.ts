import type { GameObj } from 'kaplay'

import type { Color } from '../types'

const BAR_PADDING = 2
const DEFAULT_FILL_COLOR: Color = [186, 88, 90]
const DEFAULT_OUTLINE_COLOR: Color = [221, 178, 160]
const DEFAULT_TRACK_COLOR: Color = [52, 37, 44]

export function addHealthBar({
  current,
  max,
  width,
  height,
  x = 0,
  y = 0,
  fillColor = DEFAULT_FILL_COLOR,
  outlineColor = DEFAULT_OUTLINE_COLOR,
  trackColor = DEFAULT_TRACK_COLOR,
  parent,
}: {
  current: number
  max: number
  width: number
  height: number
  x?: number
  y?: number
  fillColor?: Color
  outlineColor?: Color
  trackColor?: Color
  parent?: GameObj
}) {
  const addFn = parent ? parent.add.bind(parent) : add
  const healthbar = addFn([pos(x, y)])

  const innerWidth = Math.max(0, width - BAR_PADDING * 2)
  const innerHeight = Math.max(0, height - BAR_PADDING * 2)

  healthbar.add([
    rect(width, height, { radius: height / 2 }),
    color(outlineColor),
  ])

  healthbar.add([
    rect(innerWidth, innerHeight, { radius: innerHeight / 2 }),
    color(trackColor),
    pos(BAR_PADDING),
  ])

  const fill = healthbar.add([
    rect(0, innerHeight, { radius: innerHeight / 2 }),
    color(fillColor),
    pos(BAR_PADDING),
  ])

  const sync = (nextCurrent: number, nextMax: number) => {
    const safeMax = Math.max(1, nextMax)
    const clampedCurrent = Math.max(0, Math.min(nextCurrent, safeMax))
    let fillRatio = clampedCurrent / safeMax
    // HACK: fix visual bug where health protrudes bar
    if (fillRatio < 0.051) {
      fillRatio = 0.051
    }
    fill.width = innerWidth * fillRatio
  }

  sync(current, max)

  return {
    destroy() {
      healthbar.destroy()
    },
    root: healthbar,
    sync,
  }
}
