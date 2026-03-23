import { TAG } from '../constants'
import type { CardDefinition } from '../types'

interface RewardOptions {
  definition: CardDefinition
  onClick: () => void
  x: number
  y: number
}

export function addReward({ definition, onClick, x, y }: RewardOptions) {
  const panel = add([
    rect(164, 186, { radius: 20 }),
    area(),
    color(definition.accent[0], definition.accent[1], definition.accent[2]),
    outline(3, rgb(239, 242, 249)),
    fixed(),
    pos(x, y),
    anchor('center'),
    z(33),
    TAG.UI,
  ])

  panel.onHover(() => {
    panel.color = rgb(
      Math.min(definition.accent[0] + 18, 255),
      Math.min(definition.accent[1] + 18, 255),
      Math.min(definition.accent[2] + 18, 255),
    )
  })

  panel.onHoverEnd(() => {
    panel.color = rgb(
      definition.accent[0],
      definition.accent[1],
      definition.accent[2],
    )
  })

  panel.onClick(onClick)

  const label = add([
    text(definition.label, {
      align: 'center',
      size: 28,
      width: 132,
    }),
    color(15, 20, 28),
    fixed(),
    pos(x, y - 48),
    anchor('center'),
    z(34),
    TAG.UI,
  ])

  const description = add([
    text(definition.description, {
      align: 'center',
      size: 16,
      width: 132,
    }),
    color(24, 31, 44),
    fixed(),
    pos(x, y + 18),
    anchor('center'),
    z(34),
    TAG.UI,
  ])

  return {
    description,
    label,
    panel,
  }
}
