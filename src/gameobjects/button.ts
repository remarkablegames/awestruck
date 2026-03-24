import type { AreaComp, ColorComp, Comp, GameObj, PosComp, ZComp } from 'kaplay'

import { sound } from '../utils'

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
    pos(x, y),
    anchor('center'),
    ...buttonComps,
  ]) as GameObj<AreaComp | ColorComp | PosComp | ZComp>

  if (!disabled) {
    const playTick = sound.createTickPlayer()

    button.onHover(() => {
      playTick()
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
    pos(x, y),
    anchor('center'),
    ...labelComps,
  ])

  return {
    button,
    label: buttonLabel,
  }
}
