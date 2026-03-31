import type { GameObj } from 'kaplay'

const WIDTH = 238
const HEIGHT = 90

export function addTooltip({
  parent,
  message,
  x,
  y,
}: {
  parent: GameObj
  message: string
  x: number
  y: number
}) {
  const root = parent.add([pos(x, y), z(2)])
  root.hidden = true

  root.add([
    rect(WIDTH, HEIGHT, { radius: 14 }),
    color(10, 14, 22),
    outline(2, rgb(214, 224, 247)),
    anchor('center'),
  ])

  root.add([
    text(message, {
      align: 'center',
      size: 18,
      width: WIDTH - 28,
    }),
    color(240, 243, 255),
    anchor('center'),
  ])

  return {
    hide() {
      root.hidden = true
    },

    show() {
      root.hidden = false
    },
  }
}
