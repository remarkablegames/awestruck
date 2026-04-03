import type { GameObj } from 'kaplay'

import { LAYER } from '../constants'

interface PillOptions {
  height: number
  label: string
  parent: GameObj
  width: number
  x: number
  y: number
}

const DEFAULT_FILL_COLOR: [number, number, number] = [24, 31, 46]
const DEFAULT_OUTLINE_COLOR: [number, number, number] = [245, 247, 255]
const DEFAULT_TEXT_COLOR: [number, number, number] = [245, 247, 255]
const DEFAULT_TEXT_SIZE = 14
const DEFAULT_TEXT_WIDTH_PADDING = 8
const DEFAULT_OPACITY = 0.88

export function addPill({ height, label, parent, width, x, y }: PillOptions) {
  const root = parent.add([
    rect(width, height, { radius: 999 }),
    color(...DEFAULT_FILL_COLOR),
    opacity(DEFAULT_OPACITY),
    outline(2, rgb(...DEFAULT_OUTLINE_COLOR)),
    pos(x, y),
    anchor('center'),
    z(LAYER.CARD_PILL),
  ])

  root.add([
    text(label, {
      align: 'center',
      size: DEFAULT_TEXT_SIZE,
      width: width - DEFAULT_TEXT_WIDTH_PADDING,
    }),
    color(...DEFAULT_TEXT_COLOR),
    anchor('center'),
  ])

  return { root }
}
