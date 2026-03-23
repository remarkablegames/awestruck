import type {
  AreaComp,
  ColorComp,
  Comp,
  FixedComp,
  GameObj,
  PosComp,
  ZComp,
} from 'kaplay'

import { SOUND, TAG } from '../constants'
import type { CardDefinition, CardInstance } from '../types'

export const CARD_WIDTH = 156
export const CARD_HEIGHT = 244

interface CardOptions {
  card: CardInstance
  definition: CardDefinition
  disabled?: boolean
  onClick: (card: CardInstance) => void
  panelComps?: Comp[]
  x: number
  y: number
}

export function addCard({
  card,
  definition,
  disabled = false,
  onClick,
  panelComps = [],
  x,
  y,
}: CardOptions) {
  const panel = add([
    rect(CARD_WIDTH, CARD_HEIGHT, { radius: 18 }),
    area(),
    color(
      disabled ? 75 : definition.accent[0],
      disabled ? 81 : definition.accent[1],
      disabled ? 98 : definition.accent[2],
    ),
    outline(3, rgb(229, 233, 246)),
    fixed(),
    pos(x, y),
    z(10),
    ...panelComps,
    TAG.UI,
  ]) as GameObj<AreaComp | ColorComp | FixedComp | PosComp | ZComp>

  if (!disabled) {
    panel.onHover(() => {
      play(SOUND.TICK)
      setCursor('pointer')
      panel.color = rgb(
        Math.min(definition.accent[0] + 18, 255),
        Math.min(definition.accent[1] + 18, 255),
        Math.min(definition.accent[2] + 18, 255),
      )
    })

    panel.onHoverEnd(() => {
      setCursor('default')
      panel.color = rgb(
        definition.accent[0],
        definition.accent[1],
        definition.accent[2],
      )
    })

    panel.onClick(() => {
      play(SOUND.CLICK)
      setCursor('default')
      onClick(card)
    })

    panel.onDestroy(() => {
      setCursor('default')
    })
  }

  add([
    text(definition.label, {
      align: 'center',
      size: 30,
      width: CARD_WIDTH - 18,
    }),
    color(15, 20, 28),
    fixed(),
    pos(x + CARD_WIDTH / 2, y + 34),
    anchor('center'),
    z(11),
    TAG.UI,
  ])

  add([
    rect(34, 34, { radius: 10 }),
    color(28, 36, 52),
    outline(2, rgb(245, 247, 255)),
    fixed(),
    pos(x - 14, y - 10),
    z(11),
    TAG.UI,
  ])

  add([
    text(String(definition.cost), {
      align: 'center',
      size: 20,
      width: 34,
    }),
    color(245, 247, 255),
    fixed(),
    pos(x + 3, y + 7),
    anchor('center'),
    z(12),
    TAG.UI,
  ])

  add([
    text(toRoleLabel(definition.type), {
      align: 'center',
      size: 18,
      width: CARD_WIDTH - 18,
    }),
    color(32, 44, 62),
    fixed(),
    pos(x + CARD_WIDTH / 2, y + 78),
    anchor('center'),
    z(11),
    TAG.UI,
  ])

  add([
    text(definition.description, {
      size: 18,
      width: CARD_WIDTH - 24,
    }),
    color(27, 35, 48),
    fixed(),
    pos(x + 14, y + 118),
    z(11),
    TAG.UI,
  ])

  return { panel }
}

function toRoleLabel(type: 'modifier' | 'payload') {
  switch (type) {
    case 'modifier':
      return 'Modifier'
    case 'payload':
      return 'Payload'
  }
}
