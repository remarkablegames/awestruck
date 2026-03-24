import type { GameObj } from 'kaplay'

import { CARD, HAND, SOUND } from '../constants'
import type { CardDefinition, CardInstance } from '../types'
import { sound } from '../utils'

interface CardOptions {
  angle?: number
  card: CardInstance
  definition: CardDefinition
  disabled?: boolean
  disabledReason?: string | null
  interactiveLeft?: number
  interactiveWidth?: number
  onClick: (card: CardInstance) => void
  parent?: GameObj
  scale?: number
  x: number
  y: number
}

export function addCard({
  angle = 0,
  card,
  definition,
  disabled = false,
  disabledReason = null,
  interactiveLeft = 0,
  interactiveWidth = CARD.WIDTH,
  onClick,
  parent,
  scale: initialScale = 1,
  x,
  y,
}: CardOptions) {
  const root = parent
    ? parent.add([pos(x, y), rotate(angle), scale(initialScale), z(0)])
    : add([pos(x, y), rotate(angle), scale(initialScale), z(0)])

  const panel = root.add([
    rect(CARD.WIDTH, CARD.HEIGHT, { radius: 18 }),
    area({
      shape: new Rect(vec2(interactiveLeft, 0), interactiveWidth, CARD.HEIGHT),
    }),
    color(
      disabled ? 75 : definition.accent[0],
      disabled ? 81 : definition.accent[1],
      disabled ? 98 : definition.accent[2],
    ),
    outline(3, rgb(229, 233, 246)),
    pos(-CARD.WIDTH / 2, -CARD.HEIGHT / 2),
  ])

  if (!disabled) {
    const playTick = sound.createTickPlayer()
    const basePos = vec2(x, y)

    panel.onHover(() => {
      playTick()
      setCursor('pointer')

      root.scaleTo(initialScale * HAND.HOVER_SCALE)
      root.pos = basePos.add(0, -HAND.HOVER_LIFT)
      root.z = 1

      panel.color = rgb(
        Math.min(definition.accent[0] + 18, 255),
        Math.min(definition.accent[1] + 18, 255),
        Math.min(definition.accent[2] + 18, 255),
      )
    })

    panel.onHoverEnd(() => {
      setCursor('default')
      root.scaleTo(initialScale)
      root.pos = basePos
      root.z = 0

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
      root.scaleTo(initialScale)
      root.pos = basePos
    })
  } else if (disabledReason) {
    let disabledHintBackground: GameObj | null = null
    let disabledHintText: GameObj | null = null

    panel.onHover(() => {
      disabledHintBackground ??= add([
        rect(CARD.WIDTH + 88, 90, { radius: 14 }),
        color(10, 14, 22),
        outline(2, rgb(214, 224, 247)),
        pos(root.pos.x, root.pos.y - (CARD.HEIGHT * root.scale.y) / 2 - 46),
        anchor('center'),
      ])

      disabledHintText ??= add([
        text(disabledReason, {
          align: 'center',
          size: 18,
          width: CARD.WIDTH + 60,
        }),
        color(240, 243, 255),
        pos(root.pos.x, root.pos.y - (CARD.HEIGHT * root.scale.y) / 2 - 46),
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

  root.add([
    text(definition.label, {
      align: 'center',
      size: 30,
      width: CARD.WIDTH - 18,
    }),
    color(15, 20, 28),
    pos(0, -CARD.HEIGHT / 2 + 34),
    anchor('center'),
  ])

  root.add([
    rect(34, 34, { radius: 10 }),
    color(28, 36, 52),
    outline(2, rgb(245, 247, 255)),
    pos(-CARD.WIDTH / 2 - 14, -CARD.HEIGHT / 2 - 10),
  ])

  root.add([
    text(String(definition.cost), {
      align: 'center',
      size: 20,
      width: 34,
    }),
    color(245, 247, 255),
    pos(-CARD.WIDTH / 2 + 3, -CARD.HEIGHT / 2 + 7),
    anchor('center'),
  ])

  root.add([
    text(toRoleLabel(definition.type), {
      align: 'center',
      size: 18,
      width: CARD.WIDTH - 18,
    }),
    color(32, 44, 62),
    pos(0, -CARD.HEIGHT / 2 + 78),
    anchor('center'),
  ])

  root.add([
    text(definition.description, {
      size: 18,
      width: CARD.WIDTH - 24,
    }),
    color(27, 35, 48),
    pos(-CARD.WIDTH / 2 + 14, -CARD.HEIGHT / 2 + 118),
  ])

  return {
    panel,
    root,
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
