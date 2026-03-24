import type { GameObj } from 'kaplay'

import { getCardCommitDisabledReason, getCardDefinition } from '../combat'
import { CARD, HAND } from '../constants'
import type { CardInstance, CombatState } from '../types'
import { addCard } from './card'

interface AddHandOptions {
  onCardClick: (card: CardInstance) => void
  scrollOffset?: number
  state: CombatState
}

interface HandLayoutCard {
  angle: number
  cardIndex: number
  interactiveLeft: number
  interactiveWidth: number
  scale: number
  x: number
  y: number
  z: number
}

export interface HandRenderResult {
  canScrollLeft: boolean
  canScrollRight: boolean
  maxScrollOffset: number
  objects: GameObj[]
}

export function addHand({
  onCardClick,
  scrollOffset = 0,
  state,
}: AddHandOptions): HandRenderResult {
  const objects: GameObj[] = []
  const hand = add([pos()])
  objects.push(hand)

  const layout = getHandLayout(state.hand.length, scrollOffset)

  layout.cards.forEach((cardLayout) => {
    const card = state.hand[cardLayout.cardIndex]
    const disabledReason = getCardCommitDisabledReason(state, card)

    const cardObjects = addCard({
      card,
      definition: getCardDefinition(card.cardId),
      disabled: Boolean(disabledReason),
      disabledReason,
      interactiveLeft: cardLayout.interactiveLeft,
      interactiveWidth: cardLayout.interactiveWidth,
      onClick: onCardClick,
      parent: hand,
      scale: cardLayout.scale,
      x: cardLayout.x,
      y: cardLayout.y,
      angle: cardLayout.angle,
    })

    objects.push(cardObjects.root)
  })

  return {
    canScrollLeft: layout.canScrollLeft,
    canScrollRight: layout.canScrollRight,
    maxScrollOffset: layout.maxScrollOffset,
    objects,
  }
}

function getHandLayout(cardCount: number, scrollOffset: number) {
  if (cardCount === 0) {
    return {
      canScrollLeft: false,
      canScrollRight: false,
      cards: [] as HandLayoutCard[],
      maxScrollOffset: 0,
    }
  }

  const baseY = height() - CARD.HEIGHT - HAND.BOTTOM_MARGIN
  const centerX = width() / 2

  if (cardCount <= HAND.FAN_MAX_CARDS) {
    const spacing = getFanSpacing(cardCount)
    const center = Math.max((cardCount - 1) / 2, 0)
    const rotationStep =
      cardCount > 1 ? (HAND.MAX_ROTATION * 2) / (cardCount - 1) : 0
    const scale = getFanScale(cardCount)
    const exposedWidth = getFanExposedWidth(cardCount, scale)
    const cards = Array.from({ length: cardCount }, (_, index) => {
      const distance = index - center
      const curveProgress = center === 0 ? 0 : Math.abs(distance) / center
      const isTopCard = index === cardCount - 1

      return {
        angle: distance * rotationStep,
        cardIndex: index,
        interactiveLeft: 0,
        interactiveWidth: isTopCard ? CARD.WIDTH : exposedWidth,
        scale,
        x: centerX + distance * spacing,
        y:
          baseY +
          (CARD.HEIGHT * scale) / 2 +
          curveProgress * HAND.FAN_ARC_HEIGHT,
        z: 100 + index,
      }
    })

    return {
      canScrollLeft: false,
      canScrollRight: false,
      cards,
      maxScrollOffset: 0,
    }
  }

  const laneLeft = HAND.SCROLL_GUTTER_WIDTH
  const laneRight = width() - HAND.SCROLL_GUTTER_WIDTH
  const scrollableWidth = laneRight - laneLeft - CARD.WIDTH
  const spacing = Math.max(CARD.WIDTH * HAND.MIN_SCALE + 14, 130)
  const totalWidth =
    CARD.WIDTH * HAND.MIN_SCALE + Math.max(cardCount - 1, 0) * spacing
  const maxScrollOffset = Math.max(0, totalWidth - scrollableWidth)
  const clampedScrollOffset = clamp(scrollOffset, 0, maxScrollOffset)
  const startX =
    laneLeft + (CARD.WIDTH * HAND.MIN_SCALE) / 2 - clampedScrollOffset

  const cards = Array.from({ length: cardCount }, (_, index) => ({
    angle: 0,
    cardIndex: index,
    interactiveLeft: 0,
    interactiveWidth: CARD.WIDTH,
    scale: HAND.MIN_SCALE,
    x: startX + index * spacing,
    y: baseY + 10 + (CARD.HEIGHT * HAND.MIN_SCALE) / 2,
    z: 100 + index,
  })).filter((cardLayout) => {
    const left = cardLayout.x - (CARD.WIDTH * cardLayout.scale) / 2
    const right = cardLayout.x + (CARD.WIDTH * cardLayout.scale) / 2

    return right >= laneLeft - 40 && left <= laneRight + 40
  })

  return {
    canScrollLeft: clampedScrollOffset > 0,
    canScrollRight: clampedScrollOffset < maxScrollOffset,
    cards,
    maxScrollOffset,
  }
}

function getFanScale(cardCount: number): number {
  if (cardCount <= 5) {
    return 1
  }

  return clamp(1 - (cardCount - 5) * 0.045, HAND.MIN_SCALE, 1)
}

function getFanSpacing(cardCount: number): number {
  if (cardCount <= 1) {
    return CARD.WIDTH
  }

  const availableWidth = width() - CARD.WIDTH
  const spacingFromWidth = availableWidth / (cardCount - 1)
  return clamp(spacingFromWidth, HAND.MIN_SPACING, HAND.MAX_SPACING)
}

function getFanExposedWidth(cardCount: number, scale: number): number {
  const spacing = getFanSpacing(cardCount)
  const localWidth = spacing / scale

  return clamp(localWidth + 10, 34, CARD.WIDTH)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
