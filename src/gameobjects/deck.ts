import type { GameObj } from 'kaplay'

import { getCardDefinition } from '../combat'
import { CARD, COLOR } from '../constants'
import type { CardInstance } from '../types'
import { addButton } from './button'
import { addCard } from './card'

const HEADER_HEIGHT = 96
const HORIZONTAL_PADDING = 40
const TITLE_X = 240
const BACK_BUTTON_X = HORIZONTAL_PADDING + 72 // 112
const HEADER_Y = 52
const TITLE_Y = 32
const COUNT_Y = 64

export function addDeck({
  cards,
  helperText,
  onBack,
  onClick,
  title,
}: {
  cards: CardInstance[]
  helperText?: string
  onClick?: (card: CardInstance) => void
  onBack: () => void
  title: string
}) {
  const deck = add([])

  const cardGrid = addCards({
    cards,
    onClick,
    parent: deck,
    viewportHeight: height() - HEADER_HEIGHT,
    viewportWidth: width(),
    x: 0,
    y: HEADER_HEIGHT,
  })

  deck.add([rect(width(), HEADER_HEIGHT), color(25, 33, 52), opacity(0.96)])

  deck.add([
    rect(width(), 4),
    color(196, 211, 246),
    pos(0, HEADER_HEIGHT),
    opacity(0.9),
  ])

  addButton({
    fillColor: COLOR.BUTTON_PRIMARY,
    height: 50,
    label: 'Back',
    onClick: onBack,
    parent: deck,
    width: 144,
    x: BACK_BUTTON_X,
    y: HEADER_Y,
  })

  deck.add([
    text(title, {
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

  if (cardGrid.maxScrollOffset > 0) {
    deck.add([
      text('Scroll to browse', {
        size: 20,
      }),
      color(166, 182, 218),
      pos(width() - HORIZONTAL_PADDING - 8, COUNT_Y),
      anchor('topright'),
    ])
  }

  if (helperText) {
    deck.add([
      text(helperText, {
        size: 20,
      }),
      color(235, 198, 176),
      pos(width() - HORIZONTAL_PADDING - 8, TITLE_Y + 2),
      anchor('topright'),
    ])
  }

  return {
    content: cardGrid.content,
    maxScrollOffset: cardGrid.maxScrollOffset,
  }
}

const GRID_COLUMNS = 4
const GRID_GAP = 30
const GRID_PADDING_Y = 60

function addCards({
  cards,
  columns = GRID_COLUMNS,
  onClick,
  parent,
  scale: gridScale = 1,
  viewportHeight = height(),
  viewportWidth = width(),
  x = 0,
  y = 0,
}: {
  cards: CardInstance[]
  columns?: number
  parent?: GameObj
  scale?: number
  viewportHeight?: number
  viewportWidth?: number
  x?: number
  y?: number
  onClick?: (card: CardInstance) => void
}) {
  const addFn = parent ? parent.add.bind(parent) : add
  const grid = addFn([pos(x, y)])
  const content = grid.add([pos()])

  const scaledCardWidth = CARD.WIDTH * gridScale
  const scaledCardHeight = CARD.HEIGHT * gridScale
  const gridStepX = scaledCardWidth + GRID_GAP
  const gridStepY = scaledCardHeight + GRID_GAP
  const gridStartY = GRID_PADDING_Y + scaledCardHeight / 2
  const availableWidth = viewportWidth - HORIZONTAL_PADDING * 2
  const totalGridWidth = columns * scaledCardWidth + (columns - 1) * GRID_GAP
  const gridStartX =
    HORIZONTAL_PADDING +
    Math.max(0, (availableWidth - totalGridWidth) / 2) +
    scaledCardWidth / 2
  const rowCount = Math.ceil(cards.length / columns)
  const contentHeight =
    rowCount > 0
      ? rowCount * scaledCardHeight +
        Math.max(0, rowCount - 1) * GRID_GAP +
        GRID_PADDING_Y * 2
      : 0
  const maxScrollOffset = Math.max(0, contentHeight - viewportHeight)

  cards.forEach((card, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    addCard({
      definition: getCardDefinition(card.cardId),
      onClick: () => {
        onClick?.(card)
      },
      parent: content,
      scale: gridScale,
      x: gridStartX + column * gridStepX,
      y: gridStartY + row * gridStepY,
    })
  })

  return {
    content,
    maxScrollOffset,
  }
}
