import type { GameObj } from 'kaplay'

import { getDeckCountLabel } from '../combat'
import type { CombatState } from '../types'
import { addHealthBar } from '.'

interface StatusOptions {
  state: CombatState
  x: number
  y: number
}

const FLOOR_ROW_OFFSET_Y = 0
const PLAYER_HP_ROW_OFFSET_Y = 38
const PLAYER_HP_BAR_OFFSET_Y = 66
const RESOURCE_ROW_OFFSET_Y = 98
const DECK_ROW_OFFSET_Y = 128
const PLAYER_HP_BAR_WIDTH = 220
const PLAYER_HP_BAR_HEIGHT = 16
const PLAYER_HP_BAR_FILL_COLOR: [number, number, number] = [103, 142, 217]
const PLAYER_HP_BAR_TRACK_COLOR: [number, number, number] = [30, 41, 64]
const PLAYER_HP_BAR_OUTLINE_COLOR: [number, number, number] = [191, 214, 255]

export function addStatus({ state, x, y }: StatusOptions): GameObj[] {
  const floorText = add([
    text(`Floor ${String(state.floor)}, Turn ${String(state.turn)}`, {
      size: 26,
    }),
    color(247, 232, 179),
    pos(x, y + FLOOR_ROW_OFFSET_Y),
  ])

  const playerHealthText = add([
    text(
      `Player HP ${String(state.player.health)}/${String(state.player.maxHealth)}`,
      {
        size: 20,
      },
    ),
    color(227, 239, 255),
    pos(x, y + PLAYER_HP_ROW_OFFSET_Y),
  ])

  const playerHealthBar = addHealthBar({
    current: state.player.health,
    fillColor: PLAYER_HP_BAR_FILL_COLOR,
    height: PLAYER_HP_BAR_HEIGHT,
    max: state.player.maxHealth,
    outlineColor: PLAYER_HP_BAR_OUTLINE_COLOR,
    trackColor: PLAYER_HP_BAR_TRACK_COLOR,
    width: PLAYER_HP_BAR_WIDTH,
    x,
    y: y + PLAYER_HP_BAR_OFFSET_Y,
  })

  const resourceText = add([
    text(
      `Block ${String(state.player.block)}, Energy ${String(state.player.energy)}/${String(state.player.maxEnergy)}`,
      {
        size: 20,
      },
    ),
    color(171, 198, 255),
    pos(x, y + RESOURCE_ROW_OFFSET_Y),
  ])

  const deckText = add([
    text(
      `Draw ${String(state.drawPile.length)}, Discard ${String(state.discardPile.length)}, Deck ${getDeckCountLabel(state)}`,
      {
        size: 20,
      },
    ),
    color(155, 166, 196),
    pos(x, y + DECK_ROW_OFFSET_Y),
  ])

  return [
    floorText,
    playerHealthText,
    playerHealthBar.root,
    resourceText,
    deckText,
  ]
}
