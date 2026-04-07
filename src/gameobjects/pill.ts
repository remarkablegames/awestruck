import type { GameObj } from 'kaplay'

import { LAYER } from '../constants'
import type { Color } from '../types'

const TEXT_SIZE = 14
const WIDTH = 90
const HEIGHT = 20
const FILL_COLOR: Color = [24, 31, 46]
const OUTLINE_COLOR: Color = [216, 217, 224]
const TEXT_COLOR: Color = [245, 247, 255]

export function addPill({
  label,
  size = TEXT_SIZE,
  width = WIDTH,
  height = HEIGHT,
  x = 0,
  y = 0,
  parent,
}: {
  label: string
  size?: number
  width?: number
  height?: number
  x?: number
  y?: number
  parent?: GameObj
}) {
  const addFn = parent ? parent.add.bind(parent) : add

  const pill = addFn([
    rect(width, height, { radius: 999 }),
    color(FILL_COLOR),
    outline(2, rgb(...OUTLINE_COLOR)),
    pos(x, y),
    anchor('center'),
    z(LAYER.CARD_PILL),
  ])

  const labelText = pill.add([
    text(label, { size }),
    color(TEXT_COLOR),
    anchor('center'),
  ])

  return {
    sync(text: string) {
      labelText.text = text
    },
    root: pill,
  }
}
