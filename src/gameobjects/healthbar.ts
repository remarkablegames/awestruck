import type { GameObj } from 'kaplay'

import type { Color } from '../types'

interface HealthBarOptions {
  current: number
  fillColor?: Color
  height: number
  max: number
  outlineColor?: Color
  parent?: GameObj
  trackColor?: Color
  width: number
  x: number
  y: number
}

const BAR_PADDING = 2
const DEFAULT_FILL_COLOR: Color = [186, 88, 90]
const DEFAULT_OUTLINE_COLOR: Color = [221, 178, 160]
const DEFAULT_TRACK_COLOR: Color = [52, 37, 44]

export function addHealthBar({
  current,
  fillColor = DEFAULT_FILL_COLOR,
  height,
  max,
  outlineColor = DEFAULT_OUTLINE_COLOR,
  parent,
  trackColor = DEFAULT_TRACK_COLOR,
  width,
  x,
  y,
}: HealthBarOptions) {
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
    const fillRatio = clampedCurrent / safeMax
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
