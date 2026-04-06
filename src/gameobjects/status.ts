import type { GameObj } from 'kaplay'

import { getDeckCountLabel } from '../combat'
import { RELICS, SCENE, SOUND } from '../constants'
import type { Color, CombatState } from '../types'
import { addButton, addHealthBar, addPill, addShield } from '.'

interface StatusOptions {
  state: CombatState
  x: number
  y: number
}

const PLAYER_HP_BAR_FILL_COLOR: Color = [103, 142, 217]
const PLAYER_HP_BAR_HEIGHT = 30
const PLAYER_HP_BAR_OFFSET_Y = 66
const PLAYER_HP_BAR_OUTLINE_COLOR: Color = [191, 214, 255]
const PLAYER_HP_BAR_TRACK_COLOR: Color = [30, 41, 64]
const PLAYER_HP_BAR_WIDTH = 300
const PLAYER_HP_ROW_OFFSET_Y = 38
const PLAYER_SHIELD_OFFSET_X = 30

const RESOURCE_ROW_OFFSET_Y = PLAYER_HP_BAR_OFFSET_Y + 50 // 116
const DECK_ROW_OFFSET_Y = RESOURCE_ROW_OFFSET_Y + 30 // 146

const DECK_BUTTON_WIDTH = 100
const DECK_BUTTON_HEIGHT = 35
const DECK_BUTTON_OFFSET_Y = DECK_ROW_OFFSET_Y + 50 // 196

const RELIC_PILL_GAP = 12
const RELIC_PILL_WIDTH = 118
const RELIC_PILL_HEIGHT = 30
const RELIC_ROW_OFFSET_Y = DECK_BUTTON_OFFSET_Y + 35 // 231

export function addStatus({ state, x, y }: StatusOptions): { root: GameObj } {
  const status = add([pos(x, y)])

  status.add([
    text(`Floor ${String(state.floor)}, Turn ${String(state.turn)}`, {
      size: 26,
    }),
    color(247, 232, 179),
  ])

  status.add([
    text('Player HP:', { size: 20 }),
    color(227, 239, 255),
    pos(0, PLAYER_HP_ROW_OFFSET_Y),
  ])

  addHealthBar({
    current: state.player.health,
    fillColor: PLAYER_HP_BAR_FILL_COLOR,
    height: PLAYER_HP_BAR_HEIGHT,
    max: state.player.maxHealth,
    outlineColor: PLAYER_HP_BAR_OUTLINE_COLOR,
    parent: status,
    trackColor: PLAYER_HP_BAR_TRACK_COLOR,
    width: PLAYER_HP_BAR_WIDTH,
    x: 0,
    y: PLAYER_HP_BAR_OFFSET_Y,
  })

  addShield({
    parent: status,
    value: state.player.block,
    x: PLAYER_HP_BAR_WIDTH + PLAYER_SHIELD_OFFSET_X,
    y: PLAYER_HP_BAR_OFFSET_Y + PLAYER_HP_BAR_HEIGHT / 2,
  })

  status.add([
    text(`${String(state.player.health)}/${String(state.player.maxHealth)}`, {
      align: 'center',
      size: 18,
      width: PLAYER_HP_BAR_WIDTH,
    }),
    color(234, 242, 255),
    pos(
      PLAYER_HP_BAR_WIDTH / 2,
      PLAYER_HP_BAR_OFFSET_Y + 1 + PLAYER_HP_BAR_HEIGHT / 2,
    ),
    anchor('center'),
  ])

  status.add([
    text(
      `Block ${String(state.player.block)}, Energy ${String(state.player.energy)}/${String(state.player.maxEnergy)}`,
      {
        size: 20,
      },
    ),
    color(171, 198, 255),
    pos(0, RESOURCE_ROW_OFFSET_Y),
  ])

  status.add([
    text(
      `Draw ${String(state.drawPile.length)}, Discard ${String(state.discardPile.length)}, Deck ${getDeckCountLabel(state)}`,
      {
        size: 20,
      },
    ),
    color(155, 166, 196),
    pos(0, DECK_ROW_OFFSET_Y),
  ])

  if (state.relics.length) {
    status.add([
      text('Relics:', { size: 20 }),
      color(255, 210, 198),
      pos(0, RELIC_ROW_OFFSET_Y),
    ])

    state.relics.forEach((relicId, index) => {
      addPill({
        height: RELIC_PILL_HEIGHT,
        label: RELICS.RELIC_DEFINITIONS[relicId].label,
        parent: status,
        width: RELIC_PILL_WIDTH,
        x:
          92 +
          RELIC_PILL_WIDTH / 2 +
          index * (RELIC_PILL_WIDTH + RELIC_PILL_GAP),
        y: RELIC_ROW_OFFSET_Y + 12,
      })
    })
  }

  addButton({
    fillColor: [124, 106, 164],
    height: DECK_BUTTON_HEIGHT,
    label: 'Deck',
    onClick: () => {
      play(SOUND.CLICK)
      go(SCENE.DECK, 'view')
    },
    parent: status,
    width: DECK_BUTTON_WIDTH,
    x: DECK_BUTTON_WIDTH / 2,
    y: DECK_BUTTON_OFFSET_Y,
  })

  return { root: status }
}
