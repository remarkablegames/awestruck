import { CARD_DEFINITIONS, REWARD_POOLS, STARTER_DECK } from '../data/cards'
import { WORD_DEFINITIONS } from '../data/words'
import type {
  CardDefinition,
  CardEffect,
  CardInstance,
  CombatState,
  EnemyIntent,
  EnemyState,
  WordDefinition,
  WordResolution,
} from '../types'

const HAND_SIZE = 5
const MAX_ENERGY = 3
const MAX_FLOOR = 3
const PLAYER_MAX_HEALTH = 42
const toLabel = (value: number) => String(value)

export function getCardDefinition(cardId: string): CardDefinition {
  return CARD_DEFINITIONS[cardId]
}

export function getWordResolution(builder: CardInstance[]): WordResolution {
  if (builder.length === 0) {
    return {
      status: 'empty',
    }
  }

  const sequence = builder.map((card) => card.cardId)
  const exactMatch = WORD_DEFINITIONS.find((word) =>
    isSameSequence(word.sequence, sequence),
  )

  if (exactMatch) {
    return {
      status: 'ready',
      word: exactMatch,
    }
  }

  const hasPrefix = WORD_DEFINITIONS.some((word) =>
    isPrefix(word.sequence, sequence),
  )

  if (hasPrefix) {
    return {
      status: 'building',
    }
  }

  return {
    status: 'invalid',
  }
}

export function createInitialState(bestFloor: number): CombatState {
  const deckList = STARTER_DECK.map((cardId, index) => ({
    cardId,
    instanceId: `card-${toLabel(index)}`,
  }))

  return createFloorState({
    bestFloor,
    deckList,
    floor: 1,
    nextInstanceId: deckList.length,
  })
}

export function commitFragment(state: CombatState, instanceId: string): void {
  if (state.status !== 'playerTurn') {
    return
  }

  if (state.confirmedWordThisTurn) {
    state.message = 'You can only confirm one word per turn.'
    return
  }

  const handIndex = state.hand.findIndex(
    (card) => card.instanceId === instanceId,
  )

  if (handIndex < 0) {
    return
  }

  const card = state.hand[handIndex]
  const definition = getCardDefinition(card.cardId)

  if (definition.type !== 'fragment') {
    return
  }

  if (state.player.energy < definition.cost) {
    state.message = 'Not enough energy to commit that fragment.'
    return
  }

  const prospectiveBuilder = [...state.builder, card]
  const resolution = getWordResolution(prospectiveBuilder)

  if (resolution.status === 'invalid') {
    state.message = `${definition.label} does not connect to a known word from here.`
    return
  }

  state.player.energy -= definition.cost
  state.hand.splice(handIndex, 1)
  state.builder.push(card)

  if (resolution.status === 'ready') {
    state.message = `${resolution.word.label} is ready. Confirm to resolve it.`
    return
  }

  state.message = 'The word is still building.'
}

export function playUtilityCard(state: CombatState, instanceId: string): void {
  if (state.status !== 'playerTurn') {
    return
  }

  const handIndex = state.hand.findIndex(
    (card) => card.instanceId === instanceId,
  )

  if (handIndex < 0) {
    return
  }

  const card = state.hand[handIndex]
  const definition = getCardDefinition(card.cardId)

  if (definition.type !== 'utility') {
    return
  }

  if (state.player.energy < definition.cost) {
    state.message = 'Not enough energy to play that card.'
    return
  }

  state.player.energy -= definition.cost
  state.hand.splice(handIndex, 1)
  state.discardPile.push(card)

  const combatEnded = applyCardEffect(state, definition.effect)

  if (!combatEnded) {
    state.message = `${definition.label} resolves.`
  }
}

export function cancelBuilder(state: CombatState): void {
  if (state.status !== 'playerTurn' || state.builder.length === 0) {
    return
  }

  state.hand.push(...state.builder)
  state.builder = []
  state.message =
    'The unfinished word returns to your hand. Energy is still spent.'
}

export function confirmBuilder(state: CombatState): void {
  if (state.status !== 'playerTurn') {
    return
  }

  if (state.confirmedWordThisTurn) {
    state.message = 'You have already confirmed a word this turn.'
    return
  }

  const resolution = getWordResolution(state.builder)

  if (resolution.status !== 'ready') {
    state.message = 'There is no valid word to confirm.'
    return
  }

  const combatEnded = applyWordEffect(state, resolution.word)
  state.discardPile.push(...state.builder)
  state.builder = []
  state.confirmedWordThisTurn = true

  if (!combatEnded) {
    state.message = `${resolution.word.label} resolves.`
  }
}

export function endTurn(state: CombatState): void {
  if (state.status !== 'playerTurn') {
    return
  }

  if (state.builder.length > 0) {
    state.message = 'Confirm or cancel the current word before ending the turn.'
    return
  }

  state.discardPile.push(...state.hand)
  state.hand = []

  runEnemyTurn(state)
}

export function chooseReward(state: CombatState, cardId: string): void {
  if (state.status !== 'reward') {
    return
  }

  const rewardCard = createCardInstance(cardId, state.nextInstanceId)
  state.nextInstanceId += 1
  state.deckList.push(rewardCard)

  const nextFloor = state.floor + 1
  const nextState = createFloorState({
    bestFloor: state.bestFloor,
    deckList: state.deckList,
    floor: nextFloor,
    nextInstanceId: state.nextInstanceId,
  })

  replaceState(state, nextState)
  state.message = `${CARD_DEFINITIONS[cardId].label} joins the deck for floor ${toLabel(state.floor)}.`
}

export function getRewardDefinitions(state: CombatState): CardDefinition[] {
  return state.rewardOptions.map((cardId) => getCardDefinition(cardId))
}

export function getDeckCountLabel(state: CombatState): string {
  return `${toLabel(state.deckList.length)} cards`
}

function createFloorState({
  bestFloor,
  deckList,
  floor,
  nextInstanceId,
}: {
  bestFloor: number
  deckList: CardInstance[]
  floor: number
  nextInstanceId: number
}): CombatState {
  const state: CombatState = {
    bestFloor: Math.max(bestFloor, floor),
    builder: [],
    confirmedWordThisTurn: false,
    deckList,
    discardPile: [],
    drawPile: shuffle([...deckList]),
    enemy: createEnemyState(floor),
    floor,
    hand: [],
    message: `Floor ${toLabel(floor)} begins. Shape a word before the Archivist strikes.`,
    nextInstanceId,
    player: {
      block: 0,
      energy: MAX_ENERGY,
      health: PLAYER_MAX_HEALTH,
      maxEnergy: MAX_ENERGY,
      maxHealth: PLAYER_MAX_HEALTH,
    },
    rewardOptions: [],
    status: 'playerTurn',
    turn: 1,
  }

  drawCards(state, HAND_SIZE)

  return state
}

function applyWordEffect(state: CombatState, word: WordDefinition): boolean {
  return applyCardEffect(state, word.effect)
}

function applyCardEffect(state: CombatState, effect: CardEffect): boolean {
  if (effect.damage) {
    dealDamageToEnemy(state, effect.damage)
  }

  if (effect.block) {
    state.player.block += effect.block
  }

  if (effect.heal) {
    state.player.health = Math.min(
      state.player.maxHealth,
      state.player.health + effect.heal,
    )
  }

  if (effect.burn) {
    state.enemy.burn += effect.burn
  }

  if (effect.draw) {
    drawCards(state, effect.draw)
  }

  if (state.enemy.health <= 0) {
    handleEnemyDefeat(state)
    return true
  }

  return false
}

function createEnemyState(floor: number): EnemyState {
  const intentSets: EnemyIntent[][] = [
    [
      {
        attack: 6,
        description: 'Strike for 6 damage.',
        id: 'jab',
        label: 'JAB',
      },
      {
        block: 5,
        description: 'Gain 5 block.',
        id: 'brace',
        label: 'BRACE',
      },
      {
        attack: 8,
        description: 'Strike for 8 damage.',
        id: 'slam',
        label: 'SLAM',
      },
    ],
    [
      {
        attack: 8,
        description: 'Strike for 8 damage.',
        id: 'lunge',
        label: 'LUNGE',
      },
      {
        block: 7,
        description: 'Gain 7 block.',
        id: 'fortify',
        label: 'FORTIFY',
      },
      {
        attack: 10,
        description: 'Strike for 10 damage.',
        id: 'crack',
        label: 'CRACK',
      },
    ],
    [
      {
        attack: 10,
        description: 'Strike for 10 damage.',
        id: 'cleave',
        label: 'CLEAVE',
      },
      {
        block: 8,
        description: 'Gain 8 block.',
        id: 'shell',
        label: 'SHELL',
      },
      {
        attack: 12,
        description: 'Strike for 12 damage.',
        id: 'ruin',
        label: 'RUIN',
      },
    ],
  ]
  const healthByFloor = [24, 32, 40]
  const intentIndex = Math.min(floor - 1, intentSets.length - 1)
  const maxHealth = healthByFloor[intentIndex]

  return {
    block: 0,
    burn: 0,
    health: maxHealth,
    intentCursor: 0,
    intents: intentSets[intentIndex],
    label: `Archivist ${toLabel(floor)}`,
    maxHealth,
  }
}

function createCardInstance(cardId: string, index: number): CardInstance {
  return {
    cardId,
    instanceId: `card-${toLabel(index)}`,
  }
}

function dealDamageToEnemy(state: CombatState, amount: number): void {
  const blocked = Math.min(state.enemy.block, amount)
  const overflow = amount - blocked

  state.enemy.block -= blocked
  state.enemy.health = Math.max(0, state.enemy.health - overflow)
}

function dealDamageToPlayer(state: CombatState, amount: number): void {
  const blocked = Math.min(state.player.block, amount)
  const overflow = amount - blocked

  state.player.block -= blocked
  state.player.health = Math.max(0, state.player.health - overflow)
}

function drawCards(state: CombatState, count: number): void {
  for (let index = 0; index < count; index += 1) {
    if (state.drawPile.length === 0) {
      if (state.discardPile.length === 0) {
        return
      }

      state.drawPile = shuffle([...state.discardPile])
      state.discardPile = []
    }

    const card = state.drawPile.shift()

    if (!card) {
      return
    }

    state.hand.push(card)
  }
}

function handleEnemyDefeat(state: CombatState): void {
  if (state.floor >= MAX_FLOOR) {
    state.status = 'won'
    state.message = 'The final Archivist falls. Your lexicon holds.'
    return
  }

  state.status = 'reward'
  state.rewardOptions = [...REWARD_POOLS[state.floor - 1]]
  state.message = 'Choose one new word to strengthen the deck.'
}

function isPrefix(fullSequence: string[], partialSequence: string[]): boolean {
  return partialSequence.every(
    (cardId, index) => fullSequence[index] === cardId,
  )
}

function isSameSequence(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

function replaceState(target: CombatState, source: CombatState): void {
  target.bestFloor = source.bestFloor
  target.builder = source.builder
  target.confirmedWordThisTurn = source.confirmedWordThisTurn
  target.deckList = source.deckList
  target.discardPile = source.discardPile
  target.drawPile = source.drawPile
  target.enemy = source.enemy
  target.floor = source.floor
  target.hand = source.hand
  target.message = source.message
  target.nextInstanceId = source.nextInstanceId
  target.player = source.player
  target.rewardOptions = source.rewardOptions
  target.status = source.status
  target.turn = source.turn
}

function runEnemyTurn(state: CombatState): void {
  const burnDamage = state.enemy.burn

  if (burnDamage > 0) {
    dealDamageToEnemy(state, burnDamage)
    state.enemy.burn = Math.max(0, state.enemy.burn - 1)

    if (state.enemy.health <= 0) {
      handleEnemyDefeat(state)
      return
    }
  }

  const intent = state.enemy.intents[state.enemy.intentCursor]

  if (intent.attack) {
    dealDamageToPlayer(state, intent.attack)
  }

  if (intent.block) {
    state.enemy.block += intent.block
  }

  if (state.player.health <= 0) {
    state.status = 'lost'
    state.message = 'The Archivist breaks your chain. Start a new run.'
    return
  }

  state.enemy.intentCursor =
    (state.enemy.intentCursor + 1) % state.enemy.intents.length
  state.player.block = 0
  state.confirmedWordThisTurn = false
  state.builder = []
  state.player.energy = state.player.maxEnergy
  state.turn += 1
  drawCards(state, HAND_SIZE)
  state.message = `${state.enemy.label} acted. Build the next word.`
}

function shuffle<Value>(items: Value[]): Value[] {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = randi(0, index + 1)
    ;[nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ]
  }

  return nextItems
}
