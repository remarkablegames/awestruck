import { CARDS, COMBAT } from '../constants'

export interface RunConfig {
  startingDeck: string[]
  startingFloor: number
  startingHandSize: number
}

export function getDefaultRunConfig(): RunConfig {
  return {
    startingDeck: [...CARDS.STARTER_DECK],
    startingFloor: 1,
    startingHandSize: COMBAT.HAND_SIZE,
  }
}

export function getRunConfigFromQuery(): RunConfig | null {
  const params = new URLSearchParams(window.location.search)
  const defaultConfig = getDefaultRunConfig()

  let hasOverride = false

  const startingFloor = parseFloor(params.get('floor'))

  if (startingFloor !== null) {
    defaultConfig.startingFloor = startingFloor
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

function parseDeck(deck: string | null): string[] | null {
  if (!deck) {
    return null
  }

  if (deck === '*') {
    return Object.keys(CARDS.CARD_DEFINITIONS)
  }

  const parsedDeck = deck
    .split(',')
    .map((cardId) => cardId.trim())
    .filter((cardId) => cardId in CARDS.CARD_DEFINITIONS)

  return parsedDeck.length ? parsedDeck : [...CARDS.STARTER_DECK]
}

function parseFloor(floor: string | null): number | null {
  if (!floor || !/^\d+$/.test(floor)) {
    return null
  }

  const parsedFloor = Number.parseInt(floor, 10)

  if (parsedFloor < 1 || parsedFloor > COMBAT.MAX_FLOOR) {
    return null
  }

  return parsedFloor
}

function parseHandSize(handSize: string | null): number | null {
  if (!handSize || !/^\d+$/.test(handSize)) {
    return null
  }

  const parsedHandSize = Number.parseInt(handSize, 10)

  if (parsedHandSize < 1) {
    return null
  }

  return parsedHandSize
}
