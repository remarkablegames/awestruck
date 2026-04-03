import type { GameObj } from 'kaplay'

import type { Color } from '../types'

interface ShieldOptions {
  parent: GameObj
  value: number
  x: number
  y: number
}

const SHIELD_WIDTH = 50
const SHIELD_TEXT_SIZE = 18
const SHIELD_FILL_COLOR: Color = [68, 79, 97]
const SHIELD_OUTLINE_COLOR: Color = [196, 207, 221]
const SHIELD_TEXT_COLOR: Color = [244, 247, 255]

export function addShield({ parent, value, x, y }: ShieldOptions) {
  const root = parent.add([
    pos(x, y),
    anchor('center'),
    opacity(value > 0 ? 1 : 0),
  ])

  root.add([
    polygon([
      vec2(-19, -22),
      vec2(19, -22),
      vec2(22, -8),
      vec2(17, 10),
      vec2(0, 24),
      vec2(-17, 10),
      vec2(-22, -8),
    ]),
    color(SHIELD_FILL_COLOR),
    outline(2, rgb(...SHIELD_OUTLINE_COLOR)),
    anchor('center'),
  ])

  const valueText = root.add([
    text(String(value), {
      align: 'center',
      size: SHIELD_TEXT_SIZE,
      width: SHIELD_WIDTH,
    }),
    color(SHIELD_TEXT_COLOR),
    pos(0, -2),
    anchor('center'),
  ])

  return {
    root,
    valueText,
  }
}
