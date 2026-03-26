import type { GameObj } from 'kaplay'

const WIDTH = 34

export function addBadge({
  label,
  parent,
  x,
  y,
}: {
  label: string
  parent: GameObj
  x: number
  y: number
}) {
  const badge = parent.add([
    rect(WIDTH, WIDTH, { radius: 10 }),
    color(28, 36, 52),
    outline(2, rgb(245, 247, 255)),
    pos(x, y),
  ])

  badge.add([
    text(label, {
      align: 'center',
      size: 20,
      width: WIDTH,
    }),
    color(245, 247, 255),
    pos(WIDTH / 2, WIDTH / 2),
    anchor('center'),
  ])
}
