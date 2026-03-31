import type { GameObj } from 'kaplay'

import { CARD, HAND, LAYER, SOUND } from '../constants'
import type { CardDefinition } from '../types'
import { sound } from '../utils'
import { addBadge } from './badge'
import { addTooltip } from './tooltip'

interface CardOptions {
  angle?: number
  definition: CardDefinition
  disabled?: boolean
  disabledReason?: string | null
  interactiveLeft?: number
  interactiveWidth?: number
  onClick: () => void
  parent?: GameObj
  scale?: number
  x: number
  y: number
}

export function addCard({
  angle = 0,
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
  const addFn = parent ? parent.add.bind(parent) : add

  const root = addFn([
    pos(x, y),
    rotate(angle),
    scale(initialScale),
    z(LAYER.CARD),
  ])

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
      onClick()
    })

    panel.onDestroy(() => {
      setCursor('default')
      root.scaleTo(initialScale)
      root.pos = basePos
    })
  } else if (disabledReason) {
    const disabledTooltip = addTooltip({
      message: disabledReason,
      parent: root,
      x: 0,
      y: -CARD.HEIGHT / 2 - 46,
    })

    panel.onHover(() => {
      disabledTooltip.show()
      setCursor('not-allowed')
    })

    panel.onHoverEnd(() => {
      setCursor('default')
      disabledTooltip.hide()
    })

    panel.onDestroy(() => {
      setCursor('default')
      disabledTooltip.hide()
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

  addBadge({
    label: String(definition.cost),
    parent: root,
    x: -CARD.WIDTH / 2 - 16,
    y: -CARD.HEIGHT / 2 - 14,
  })

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
