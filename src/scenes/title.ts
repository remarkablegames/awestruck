import { SAVE_KEY, SCENE, TAG } from '../constants'

const toLabel = (value: number) => String(value)

scene(SCENE.TITLE, () => {
  setBackground(rgb(14, 18, 28))

  const bestFloor = getData<number>(SAVE_KEY.BEST_FLOOR, 0) ?? 0
  const panelWidth = Math.min(width() - 80, 760)
  const panelHeight = 420
  const centerX = width() / 2
  const centerY = height() / 2

  add([rect(width(), height()), color(8, 12, 20), fixed(), pos(0, 0), TAG.UI])

  add([
    rect(panelWidth, panelHeight, { radius: 24 }),
    color(25, 33, 52),
    outline(4, rgb(74, 104, 168)),
    fixed(),
    pos(centerX, centerY - 8),
    anchor('center'),
    TAG.UI,
  ])

  add([
    text('AWESTRUCK', {
      size: 54,
    }),
    color(244, 229, 178),
    fixed(),
    pos(centerX, centerY - 128),
    anchor('center'),
    TAG.UI,
  ])

  add([
    text(
      'Chain whole-word cards together. Modifiers shape the next payload. Survive three Archivists.',
      {
        align: 'center',
        size: 22,
        width: panelWidth - 120,
      },
    ),
    color(218, 227, 255),
    fixed(),
    pos(centerX, centerY - 40),
    anchor('center'),
    TAG.UI,
  ])

  add([
    text(
      'Starter words: DOUBLE, QUICK, WIDE, ECHO, BURN, THORN, SHIELD, BLOOM',
      {
        align: 'center',
        size: 15,
        width: panelWidth - 140,
      },
    ),
    color(164, 190, 236),
    fixed(),
    pos(centerX, centerY + 24),
    anchor('center'),
    TAG.UI,
  ])

  add([
    text(`Best floor reached: ${toLabel(bestFloor)}`, {
      size: 20,
    }),
    color(146, 203, 145),
    fixed(),
    pos(centerX, centerY + 88),
    anchor('center'),
    TAG.UI,
  ])

  const button = add([
    rect(260, 72, { radius: 18 }),
    area(),
    color(74, 104, 168),
    outline(4, rgb(196, 216, 255)),
    fixed(),
    pos(centerX, centerY + 154),
    anchor('center'),
    TAG.UI,
  ])

  button.onHover(() => {
    button.color = rgb(92, 130, 208)
  })

  button.onHoverEnd(() => {
    button.color = rgb(74, 104, 168)
  })

  button.onClick(() => {
    go(SCENE.GAME)
  })

  add([
    text('Start Run', {
      size: 26,
    }),
    color(248, 250, 255),
    fixed(),
    pos(centerX, centerY + 154),
    anchor('center'),
    TAG.UI,
  ])

  add([
    text(
      'Build modifier chains left to right. Payloads work alone, and invalid chains are blocked before confirm.',
      {
        align: 'center',
        size: 16,
        width: panelWidth - 140,
      },
    ),
    color(171, 182, 210),
    fixed(),
    pos(centerX, centerY + 284),
    anchor('center'),
    TAG.UI,
  ])

  onKeyPress('space', () => {
    go(SCENE.GAME)
  })

  onKeyPress('enter', () => {
    go(SCENE.GAME)
  })
})
