import type { AreaComp, ColorComp, Comp, GameObj, PosComp, ZComp } from 'kaplay'

import { CARD, SOUND } from '../constants'
import type { CardDefinition, CardInstance } from '../types'
import { sound } from '../utils'

interface CardOptions {
  card: CardInstance
  definition: CardDefinition
  disabled?: boolean
  disabledReason?: string | null
  onClick: (card: CardInstance) => void
  panelComps?: Comp[]
  x: number
  y: number
}

export function addCard({
  card,
  definition,
  disabled = false,
  disabledReason = null,
  onClick,
  panelComps = [],
  x,
  y,
}: CardOptions) {
  const objects: GameObj[] = []

  const panel = add([
    rect(CARD.WIDTH, CARD.HEIGHT, { radius: 18 }),
    area(),
    color(
      disabled ? 75 : definition.accent[0],
      disabled ? 81 : definition.accent[1],
      disabled ? 98 : definition.accent[2],
    ),
    outline(3, rgb(229, 233, 246)),
    pos(x, y),
    ...panelComps,
  ]) as GameObj<AreaComp | ColorComp | PosComp | ZComp>
  objects.push(panel)

  if (!disabled) {
    const playTick = sound.createTickPlayer()

    panel.onHover(() => {
      playTick()
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
  } else if (disabledReason) {
    let disabledHintBackground: GameObj | null = null
    let disabledHintText: GameObj | null = null

    panel.onHover(() => {
      disabledHintBackground ??= add([
        rect(CARD.WIDTH + 88, 60, { radius: 14 }),
        color(10, 14, 22),
        opacity(0.88),
        outline(2, rgb(214, 224, 247)),
        pos(x + CARD.WIDTH / 2, y - 46),
        anchor('center'),
      ])

      disabledHintText ??= add([
        text(disabledReason, {
          align: 'center',
          size: 16,
          width: CARD.WIDTH + 60,
        }),
        color(240, 243, 255),
        pos(x + CARD.WIDTH / 2, y - 46),
        anchor('center'),
      ])

      setCursor('not-allowed')
    })

    panel.onHoverEnd(() => {
      setCursor('default')
      disabledHintBackground?.destroy()
      disabledHintText?.destroy()
      disabledHintBackground = null
      disabledHintText = null
    })

    panel.onDestroy(() => {
      setCursor('default')
      disabledHintBackground?.destroy()
      disabledHintText?.destroy()
    })
  }

  const label = add([
    text(definition.label, {
      align: 'center',
      size: 30,
      width: CARD.WIDTH - 18,
    }),
    color(15, 20, 28),
    pos(x + CARD.WIDTH / 2, y + 34),
    anchor('center'),
  ])
  objects.push(label)

  const costPanel = add([
    rect(34, 34, { radius: 10 }),
    color(28, 36, 52),
    outline(2, rgb(245, 247, 255)),
    pos(x - 14, y - 10),
  ])
  objects.push(costPanel)

  const costLabel = add([
    text(String(definition.cost), {
      align: 'center',
      size: 20,
      width: 34,
    }),
    color(245, 247, 255),
    pos(x + 3, y + 7),
    anchor('center'),
  ])
  objects.push(costLabel)

  const roleLabel = add([
    text(toRoleLabel(definition.type), {
      align: 'center',
      size: 18,
      width: CARD.WIDTH - 18,
    }),
    color(32, 44, 62),
    pos(x + CARD.WIDTH / 2, y + 78),
    anchor('center'),
  ])
  objects.push(roleLabel)

  const description = add([
    text(definition.description, {
      size: 18,
      width: CARD.WIDTH - 24,
    }),
    color(27, 35, 48),
    pos(x + 14, y + 118),
  ])
  objects.push(description)

  return {
    description,
    label,
    objects,
    panel,
  }
}

function toRoleLabel(type: 'modifier' | 'payload') {
  switch (type) {
    case 'modifier':
      return 'Modifier'
    case 'payload':
      return 'Payload'
  }
}
