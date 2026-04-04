import type { GameObj } from 'kaplay'

import { CARD, HAND, LAYER, SOUND } from '../constants'
import type { CardDefinition } from '../types'
import { sound } from '../utils'
import { addBadge } from './badge'
import { addPill } from './pill'
import { addTooltip } from './tooltip'

const TITLE_Y = -CARD.HEIGHT / 2 + 30
const IMAGE_FRAME_WIDTH = CARD.WIDTH - 14
const IMAGE_FRAME_HEIGHT = 82
const IMAGE_FRAME_Y = -CARD.HEIGHT / 2 + 88
const ROLE_PILL_WIDTH = 88
const ROLE_PILL_HEIGHT = 20
const ROLE_PILL_Y = -CARD.HEIGHT / 2 + 129
const DESCRIPTION_Y = -CARD.HEIGHT / 2 + 148

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
  let isDestroyed = false

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

  const roleLabel = toRoleLabel(definition.type)

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
      isDestroyed = true
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
      isDestroyed = true
      setCursor('default')
      disabledTooltip.hide()
    })
  } else {
    panel.onDestroy(() => {
      isDestroyed = true
    })
  }

  root.add([
    text(definition.label, {
      align: 'center',
      size: 24,
      width: CARD.WIDTH - 18,
    }),
    color(15, 20, 28),
    pos(0, TITLE_Y),
    anchor('center'),
  ])

  addBadge({
    label: String(definition.cost),
    parent: root,
    x: -CARD.WIDTH / 2 - 16,
    y: -CARD.HEIGHT / 2 - 14,
  })

  getSprite(definition.id)?.then((data) => {
    if (isDestroyed) {
      return
    }

    const scale = Math.min(
      IMAGE_FRAME_WIDTH / data.width,
      IMAGE_FRAME_HEIGHT / data.height,
    )

    root.add([
      sprite(definition.id, {
        height: data.height * scale,
        width: data.width * scale,
      }),
      pos(0, IMAGE_FRAME_Y),
      anchor('center'),
    ])
  })

  addPill({
    height: ROLE_PILL_HEIGHT,
    label: roleLabel,
    parent: root,
    width: ROLE_PILL_WIDTH,
    x: 0,
    y: ROLE_PILL_Y,
  })

  root.add([
    text(definition.description, {
      size: 18,
      width: CARD.WIDTH - 24,
    }),
    color(27, 35, 48),
    pos(-CARD.WIDTH / 2 + 14, DESCRIPTION_Y),
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
