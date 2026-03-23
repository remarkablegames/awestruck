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

const UI_TICK_COOLDOWN = 0.12 // seconds

interface ButtonOptions {
  buttonComps?: Comp[]
  disabled?: boolean
  fillColor: [number, number, number]
  height: number
  label: string
  labelComps?: Comp[]
  labelSize?: number
  onClick: () => void
  width: number
  x: number
  y: number
}

export function addButton({
  buttonComps = [],
  disabled = false,
  fillColor,
  height,
  label,
  labelComps = [],
  labelSize = 20,
  onClick,
  width: buttonWidth,
  x,
  y,
}: ButtonOptions) {
  const button = add([
    rect(buttonWidth, height, { radius: 18 }),
    area(),
    color(
      disabled ? 74 : fillColor[0],
      disabled ? 82 : fillColor[1],
      disabled ? 104 : fillColor[2],
    ),
    outline(3, rgb(205, 219, 255)),
    fixed(),
    pos(x, y),
    anchor('center'),
    z(20),
    ...buttonComps,
    TAG.UI,
  ]) as GameObj<AreaComp | ColorComp | FixedComp | PosComp | ZComp>

  if (!disabled) {
    let lastTickAt = -UI_TICK_COOLDOWN

    button.onHover(() => {
      const now = time()

      if (now - lastTickAt >= UI_TICK_COOLDOWN) {
        play(SOUND.TICK)
        lastTickAt = now
      }

      setCursor('pointer')
      button.color = rgb(
        Math.min(fillColor[0] + 18, 255),
        Math.min(fillColor[1] + 18, 255),
        Math.min(fillColor[2] + 18, 255),
      )
    })

    button.onHoverEnd(() => {
      setCursor('default')
      button.color = rgb(fillColor[0], fillColor[1], fillColor[2])
    })

    button.onClick(() => {
      setCursor('default')
      onClick()
    })

    button.onDestroy(() => {
      setCursor('default')
    })
  }

  const buttonLabel = add([
    text(label, {
      align: 'center',
      size: labelSize,
      width: buttonWidth - 24,
    }),
    color(247, 249, 255),
    fixed(),
    pos(x, y),
    anchor('center'),
    z(21),
    ...labelComps,
    TAG.UI,
  ])

  return {
    button,
    label: buttonLabel,
  }
}
