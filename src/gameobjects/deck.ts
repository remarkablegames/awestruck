import type { GameObj } from 'kaplay'

import { getCardDefinition } from '../combat'
import { CARD } from '../constants'
import type { CardInstance } from '../types'
import { addButton } from './button'
import { addCard } from './card'

interface DeckOptions {
  cards: CardInstance[]
  onBack: () => void
  scrollOffset: number
}

const HEADER_HEIGHT = 96
const HORIZONTAL_PADDING = 40
const TITLE_X = 240
const BACK_BUTTON_X = HORIZONTAL_PADDING + 72 // 112
const HEADER_Y = 52
const TITLE_Y = 32
const COUNT_Y = 64

const GRID_COLUMNS = 4
const GRID_GAP = 30
const GRID_PADDING_Y = 60

const GRID_STEP_X = CARD.WIDTH + GRID_GAP
const GRID_STEP_Y = CARD.HEIGHT + GRID_GAP

export function addDeck({ cards, onBack, scrollOffset }: DeckOptions): {
  maxScrollOffset: number
  root: GameObj
} {
  const deck = add([])
  const gridStartY = HEADER_HEIGHT + GRID_PADDING_Y + CARD.HEIGHT / 2
  const availableWidth = width() - HORIZONTAL_PADDING * 2
  const totalGridWidth =
    GRID_COLUMNS * CARD.WIDTH + (GRID_COLUMNS - 1) * GRID_GAP
  const gridStartX =
    HORIZONTAL_PADDING +
    Math.max(0, (availableWidth - totalGridWidth) / 2) +
    CARD.WIDTH / 2

  const rowCount = Math.ceil(cards.length / GRID_COLUMNS)
  const contentHeight =
    rowCount > 0
      ? rowCount * CARD.HEIGHT +
        Math.max(0, rowCount - 1) * GRID_GAP +
        GRID_PADDING_Y * 2
      : 0
  const viewportHeight = height() - HEADER_HEIGHT
  const maxScrollOffset = Math.max(0, contentHeight - viewportHeight)

  const content = deck.add([pos(0, -Math.min(scrollOffset, maxScrollOffset))])

  cards.forEach((card, index) => {
    const column = index % GRID_COLUMNS
    const row = Math.floor(index / GRID_COLUMNS)

    addCard({
      definition: getCardDefinition(card.cardId),
      parent: content,
      x: gridStartX + column * GRID_STEP_X,
      y: gridStartY + row * GRID_STEP_Y,
    })
  })

  deck.add([rect(width(), HEADER_HEIGHT), color(25, 33, 52), opacity(0.96)])

  deck.add([
    rect(width(), 4),
    color(196, 211, 246),
    pos(0, HEADER_HEIGHT),
    opacity(0.9),
  ])

  addButton({
    fillColor: [92, 130, 208],
    height: 50,
    label: 'Back',
    onClick: onBack,
    parent: deck,
    width: 144,
    x: BACK_BUTTON_X,
    y: HEADER_Y,
  })

  deck.add([
    text('DECK', {
      size: 34,
    }),
    color(248, 232, 181),
    pos(TITLE_X, TITLE_Y),
  ])

  deck.add([
    text(`${String(cards.length)} cards`, {
      size: 24,
    }),
    color(182, 197, 233),
    pos(TITLE_X, COUNT_Y),
  ])

  if (maxScrollOffset > 0) {
    deck.add([
      text('Scroll to browse', {
        size: 20,
      }),
      color(166, 182, 218),
      pos(width() - HORIZONTAL_PADDING - 8, COUNT_Y),
      anchor('topright'),
    ])
  }

  return {
    maxScrollOffset,
    root: deck,
  }
}
