import { CARDS, COMBAT, FLOORS, REWARDS } from '../constants'
import type { Card } from '../types'

export interface RunConfig {
  startingDeck: Card[]
  startingFloor: number
  startingHandSize: number
  startingRewardFloor?: number
}

export function getDefaultRunConfig(): RunConfig {
  return {
    startingDeck: [...CARDS.STARTER_DECK],
    startingFloor: 1,
    startingHandSize: COMBAT.HAND_SIZE,
  }
}

export function getRunConfigFromQuery(): RunConfig | null {
  const params = new URLSearchParams(location.search)
  const defaultConfig = getDefaultRunConfig()

  let hasOverride = false

  const startingFloor = parseFloor(params.get('floor'))

  if (startingFloor !== null) {
    defaultConfig.startingFloor = startingFloor
    hasOverride = true
  }

  const startingRewardFloor = parseRewardFloor(params.get('reward'))

  if (startingRewardFloor !== null) {
    defaultConfig.startingFloor = startingRewardFloor
    defaultConfig.startingRewardFloor = startingRewardFloor
    hasOverride = true
  }

  const startingDeck = parseDeck(params.get('deck'))

  if (startingDeck !== null) {
    defaultConfig.startingDeck = startingDeck
    hasOverride = true
  }

  const startingHandSize = parseHandSize(params.get('handSize'))

  if (startingHandSize !== null) {
    defaultConfig.startingHandSize = startingHandSize
    hasOverride = true
  }

  return hasOverride ? defaultConfig : null
}

function parseDeck(deck: string | null): Card[] | null {
  if (!deck) {
    return null
  }

  if (deck === '*') {
    return Object.keys(CARDS.CARD_DEFINITIONS) as Card[]
  }

  const parsedDeck = deck
    .split(',')
    .map((cardId) => cardId.trim())
    .filter((cardId) => cardId in CARDS.CARD_DEFINITIONS) as Card[]

  return parsedDeck.length ? parsedDeck : [...CARDS.STARTER_DECK]
}

function parseFloor(floor: string | null): number | null {
  if (!floor || !/^\d+$/.test(floor)) {
    return null
  }

  const parsedFloor = parseInt(floor, 10)

  if (parsedFloor < 1 || parsedFloor > FLOORS.MAX_FLOOR) {
    return null
  }

  return parsedFloor
}

function parseHandSize(handSize: string | null): number | null {
  if (!handSize || !/^\d+$/.test(handSize)) {
    return null
  }

  const parsedHandSize = parseInt(handSize, 10)

  if (parsedHandSize < 1) {
    return null
  }

  return parsedHandSize
}

function parseRewardFloor(reward: string | null): number | null {
  if (!reward || !/^\d+$/.test(reward)) {
    return null
  }

  const parsedRewardFloor = parseInt(reward, 10)

  if (parsedRewardFloor < 1 || parsedRewardFloor > REWARDS.MAX_REWARD_FLOOR) {
    return null
  }

  return parsedRewardFloor
}
