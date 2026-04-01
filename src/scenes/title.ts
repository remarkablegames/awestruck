import { CARDS, DATA, FLOORS, SCENE, SOUND, THEME } from '../constants'
import { addBackdrop, addButton } from '../gameobjects'
import { resetStateManager } from '../state'
import { music } from '../utils'

const TITLE_PANEL_Y_OFFSET = 0
const TITLE_LOGO_Y_OFFSET = -140
const TITLE_SUBTITLE_Y_OFFSET = -60
const TITLE_STARTER_WORDS_Y_OFFSET = 10
const TITLE_BEST_FLOOR_Y_OFFSET = 65
const TITLE_START_BUTTON_Y_OFFSET = 135
const TITLE_HELP_TEXT_Y_OFFSET = 270

scene(SCENE.TITLE, () => {
  setBackground(rgb(...THEME.TITLE_BACKGROUND_COLOR))

  const bestFloor = getData(DATA.BEST_FLOOR, 0)
  const panelWidth = Math.min(width() - 80, 760)
  const panelHeight = 420

  const startRun = () => {
    music.startMusic()
    play(SOUND.DROP)
    resetStateManager()
    go(SCENE.GAME)
  }

  addBackdrop({
    actionAreaTop: height() * 0.46,
    overlayOpacity: 0.04,
  })

  add([
    rect(panelWidth, panelHeight, { radius: 24 }),
    color(25, 33, 52),
    outline(4, rgb(74, 104, 168)),
    pos(center().x, center().y + TITLE_PANEL_Y_OFFSET),
    anchor('center'),
  ])

  add([
    text('AWESTRUCK', {
      size: 60,
    }),
    color(244, 229, 178),
    pos(center().x, center().y + TITLE_LOGO_Y_OFFSET),
    anchor('center'),
  ])

  add([
    text(
      `Chain whole-word cards together. Modifiers shape the next payload. Survive ${String(FLOORS.MAX_FLOOR)} floors.`,
      {
        align: 'center',
        size: 24,
        width: panelWidth - 120,
      },
    ),
    color(218, 227, 255),
    pos(center().x, center().y + TITLE_SUBTITLE_Y_OFFSET),
    anchor('center'),
  ])

  add([
    text(
      `Starter words: ${CARDS.STARTER_DECK.map((card) => card.toUpperCase()).join(', ')}`,
      {
        align: 'center',
        size: 18,
        width: panelWidth - 140,
      },
    ),
    color(164, 190, 236),
    pos(center().x, center().y + TITLE_STARTER_WORDS_Y_OFFSET),
    anchor('center'),
  ])

  add([
    text(`Best floor reached: ${String(bestFloor)}`, {
      size: 20,
    }),
    color(146, 203, 145),
    pos(center().x, center().y + TITLE_BEST_FLOOR_Y_OFFSET),
    anchor('center'),
  ])

  addButton({
    buttonComps: [outline(4, rgb(196, 216, 255))],
    fillColor: [74, 104, 168],
    height: 72,
    label: 'Start Run',
    labelComps: [color(248, 250, 255)],
    labelSize: 28,
    onClick: startRun,
    width: 260,
    x: center().x,
    y: center().y + TITLE_START_BUTTON_Y_OFFSET,
  })

  add([
    text(
      'Build modifier chains left to right. Payloads work alone, and invalid chains are blocked before confirm.',
      {
        align: 'center',
        size: 20,
        width: panelWidth - 140,
      },
    ),
    color(171, 182, 210),
    pos(center().x, center().y + TITLE_HELP_TEXT_Y_OFFSET),
    anchor('center'),
  ])

  onKeyPress('space', () => {
    startRun()
  })

  onKeyPress('enter', () => {
    startRun()
  })
})
