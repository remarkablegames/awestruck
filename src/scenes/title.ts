import { DATA, SCENE, SOUND, THEME } from '../constants'
import { addButton } from '../gameobjects'
import { resetStateManager } from '../state'
import { music } from '../utils'

const toLabel = (value: number) => String(value)

scene(SCENE.TITLE, () => {
  setBackground(rgb(...THEME.TITLE_BACKGROUND_COLOR))

  const bestFloor = getData<number>(DATA.BEST_FLOOR, 0) ?? 0
  const panelWidth = Math.min(width() - 80, 760)
  const panelHeight = 420
  const centerX = width() / 2
  const centerY = height() / 2

  const startRun = () => {
    music.startMusic()
    play(SOUND.DROP)
    resetStateManager()
    go(SCENE.GAME)
  }

  add([
    rect(width(), height()),
    color(...THEME.TITLE_BACKGROUND_COLOR),
    fixed(),
    pos(0, 0),
  ])

  add([
    rect(panelWidth, panelHeight, { radius: 24 }),
    color(25, 33, 52),
    outline(4, rgb(74, 104, 168)),
    fixed(),
    pos(centerX, centerY - 8),
    anchor('center'),
  ])

  add([
    text('AWESTRUCK', {
      size: 54,
    }),
    color(244, 229, 178),
    fixed(),
    pos(centerX, centerY - 128),
    anchor('center'),
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
  ])

  add([
    text(
      'Starter words: DOUBLE, QUICK, WIDE, ECHO, BURN, THORN, SHIELD, BLOOM, SURGE, WARD, FOCUS, WILT',
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
  ])

  add([
    text(`Best floor reached: ${toLabel(bestFloor)}`, {
      size: 20,
    }),
    color(146, 203, 145),
    fixed(),
    pos(centerX, centerY + 76),
    anchor('center'),
  ])

  addButton({
    buttonComps: [outline(4, rgb(196, 216, 255))],
    fillColor: [74, 104, 168],
    height: 72,
    label: 'Start Run',
    labelComps: [color(248, 250, 255)],
    labelSize: 26,
    onClick: startRun,
    width: 260,
    x: centerX,
    y: centerY + 142,
  })

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
  ])

  onKeyPress('space', () => {
    startRun()
  })

  onKeyPress('enter', () => {
    startRun()
  })
})
