import type { GameObj } from 'kaplay'

interface HealthBarOptions {
  current: number
  fillColor?: [number, number, number]
  height: number
  max: number
  outlineColor?: [number, number, number]
  parent?: GameObj
  trackColor?: [number, number, number]
  width: number
  x: number
  y: number
}

const BAR_PADDING = 4
const DEFAULT_FILL_COLOR: [number, number, number] = [186, 88, 90]
const DEFAULT_OUTLINE_COLOR: [number, number, number] = [221, 178, 160]
const DEFAULT_TRACK_COLOR: [number, number, number] = [52, 37, 44]

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
  const addTo = parent ? parent.add.bind(parent) : add
  const root = addTo([pos(x, y)])
  const innerWidth = Math.max(0, width - BAR_PADDING * 2)
  const innerHeight = Math.max(0, height - BAR_PADDING * 2)

  root.add([rect(width, height, { radius: height / 2 }), color(outlineColor)])

  root.add([
    rect(innerWidth, innerHeight, { radius: innerHeight / 2 }),
    color(trackColor),
    pos(BAR_PADDING),
  ])

  const fill = root.add([
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
      root.destroy()
    },
    sync,
  }
}
