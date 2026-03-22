import { CARD_DEFINITIONS, REWARD_POOLS, STARTER_DECK } from '../data/cards'
import type {
  CardDefinition,
  CardEffect,
  CardInstance,
  ChainPreview,
  CombatState,
  EnemyIntent,
  EnemyState,
  ModifierKind,
} from '../types'

const HAND_SIZE = 5
const MAX_ENERGY = 3
const MAX_FLOOR = 3
const PLAYER_MAX_HEALTH = 42
const toLabel = (value: number) => String(value)

export function getCardDefinition(cardId: string): CardDefinition {
  return CARD_DEFINITIONS[cardId]
}

export function getChainPreview(builder: CardInstance[]): ChainPreview {
  const cost = getChainCost(builder)

  if (builder.length === 0) {
    return {
      cost,
      previewText:
        'Commit modifiers, then end the chain with a payload. Payloads also work alone.',
      status: 'empty',
    }
  }

  const definitions = builder.map((card) => getCardDefinition(card.cardId))
  const utilityCard = definitions.find((card) => card.type === 'utility')

  if (utilityCard) {
    return {
      cost,
      previewText: `${utilityCard.label} is a utility card and cannot enter the chain.`,
      status: 'invalid',
    }
  }

  const payloadCards = definitions.filter((card) => card.type === 'payload')

  if (payloadCards.length === 0) {
    return {
      cost,
      previewText: 'The chain needs a payload word to resolve.',
      status: 'building',
    }
  }

  if (payloadCards.length > 1) {
    return {
      cost,
      previewText: 'A chain can end with only one payload word.',
      status: 'invalid',
    }
  }

  const payloadIndex = definitions.findIndex((card) => card.type === 'payload')

  if (payloadIndex !== definitions.length - 1) {
    return {
      cost,
      previewText: 'Modifiers must come before the final payload word.',
      status: 'invalid',
    }
  }

  const payload = definitions[payloadIndex]
  const modifiers = definitions.slice(0, payloadIndex)
  let effect = cloneEffect(payload.effect)

  for (const modifier of modifiers) {
    if (modifier.type !== 'modifier' || !modifier.modifier) {
      return {
        cost,
        previewText: `${modifier.label} cannot be used as a modifier.`,
        status: 'invalid',
      }
    }

    const nextEffect = applyModifier(effect, modifier.modifier.kind)

    if (isSameEffect(nextEffect, effect)) {
      return {
        cost,
        previewText: `${modifier.label} has no effect on ${payload.label}.`,
        status: 'invalid',
      }
    }

    effect = nextEffect
  }

  return {
    cost,
    effect,
    payload,
    previewText: `${payload.label} -> ${formatEffect(effect)}`,
    status: 'ready',
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

export function commitChainCard(state: CombatState, instanceId: string): void {
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

  if (definition.type === 'utility') {
    return
  }

  if (state.player.energy < definition.cost) {
    state.message = 'Not enough energy to commit that card.'
    return
  }

  const prospectiveBuilder = [...state.builder, card]
  const preview = getChainPreview(prospectiveBuilder)

  if (preview.status === 'invalid') {
    state.message = preview.previewText
    return
  }

  state.player.energy -= definition.cost
  state.hand.splice(handIndex, 1)
  state.builder.push(card)
  state.message = preview.previewText
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

  const refundedEnergy = getChainCost(state.builder)

  state.player.energy = Math.min(
    state.player.maxEnergy,
    state.player.energy + refundedEnergy,
  )
  state.hand.push(...state.builder)
  state.builder = []
  state.message =
    'The unfinished chain returns to your hand and refunds energy.'
}

export function confirmBuilder(state: CombatState): void {
  if (state.status !== 'playerTurn') {
    return
  }

  const preview = getChainPreview(state.builder)

  if (preview.status !== 'ready') {
    state.message = 'There is no valid chain to confirm.'
    return
  }

  const combatEnded = applyCardEffect(state, preview.effect)
  state.discardPile.push(...state.builder)
  state.builder = []

  if (!combatEnded) {
    state.message = preview.previewText
  }
}

export function endTurn(state: CombatState): void {
  if (state.status !== 'playerTurn') {
    return
  }

  if (state.builder.length > 0) {
    state.message =
      'Confirm or cancel the current chain before ending the turn.'
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

function applyModifier(
  effect: CardEffect,
  modifierKind: ModifierKind,
): CardEffect {
  switch (modifierKind) {
    case 'double':
      return mapEffect(effect, (value) => value * 2)
    case 'echo':
      return mergeEffects(
        effect,
        mapEffect(effect, (value) => Math.ceil(value / 2)),
      )
    case 'quick':
      return mergeEffects(effect, {
        damage: hasOffense(effect) ? 2 : undefined,
        block: hasDefense(effect) ? 3 : undefined,
        draw: 1,
      })
    case 'wide':
      return mergeEffects(effect, {
        block: hasDefense(effect) ? 4 : undefined,
        burn: hasOffense(effect) ? 2 : undefined,
        heal: effect.heal ? 1 : undefined,
      })
  }
}

function cloneEffect(effect: CardEffect): CardEffect {
  return {
    block: effect.block,
    burn: effect.burn,
    damage: effect.damage,
    draw: effect.draw,
    heal: effect.heal,
  }
}

function createCardInstance(cardId: string, index: number): CardInstance {
  return {
    cardId,
    instanceId: `card-${toLabel(index)}`,
  }
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
    deckList,
    discardPile: [],
    drawPile: shuffle([...deckList]),
    enemy: createEnemyState(floor),
    floor,
    hand: [],
    message: `Floor ${toLabel(floor)} begins. Build a modifier chain or play a payload alone.`,
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

function formatEffect(effect: CardEffect): string {
  const parts: string[] = []

  if (effect.damage) {
    parts.push(`deal ${toLabel(effect.damage)} damage`)
  }

  if (effect.burn) {
    parts.push(`apply ${toLabel(effect.burn)} burn`)
  }

  if (effect.block) {
    parts.push(`gain ${toLabel(effect.block)} block`)
  }

  if (effect.heal) {
    parts.push(`heal ${toLabel(effect.heal)}`)
  }

  if (effect.draw) {
    parts.push(`draw ${toLabel(effect.draw)}`)
  }

  if (parts.length === 0) {
    return 'no effect'
  }

  return parts.join(', ')
}

function getChainCost(builder: CardInstance[]): number {
  return builder.reduce(
    (total, card) => total + getCardDefinition(card.cardId).cost,
    0,
  )
}

function handleEnemyDefeat(state: CombatState): void {
  if (state.floor >= MAX_FLOOR) {
    state.status = 'won'
    state.message = 'The final Archivist falls. Your lexicon holds.'
    return
  }

  state.status = 'reward'
  state.rewardOptions = [...REWARD_POOLS[state.floor - 1]]
  state.message =
    'Choose one new word to strengthen the next modifier or payload chain.'
}

function hasOffense(effect: CardEffect): boolean {
  return Boolean(effect.damage ?? effect.burn)
}

function hasDefense(effect: CardEffect): boolean {
  return Boolean(effect.block ?? effect.heal)
}

function isSameEffect(left: CardEffect, right: CardEffect): boolean {
  return (
    left.block === right.block &&
    left.burn === right.burn &&
    left.damage === right.damage &&
    left.draw === right.draw &&
    left.heal === right.heal
  )
}

function mapEffect(
  effect: CardEffect,
  mapper: (value: number) => number,
): CardEffect {
  return {
    block: effect.block ? mapper(effect.block) : undefined,
    burn: effect.burn ? mapper(effect.burn) : undefined,
    damage: effect.damage ? mapper(effect.damage) : undefined,
    draw: effect.draw ? mapper(effect.draw) : undefined,
    heal: effect.heal ? mapper(effect.heal) : undefined,
  }
}

function mergeEffects(base: CardEffect, extra: CardEffect): CardEffect {
  return {
    block: (base.block ?? 0) + (extra.block ?? 0) || undefined,
    burn: (base.burn ?? 0) + (extra.burn ?? 0) || undefined,
    damage: (base.damage ?? 0) + (extra.damage ?? 0) || undefined,
    draw: (base.draw ?? 0) + (extra.draw ?? 0) || undefined,
    heal: (base.heal ?? 0) + (extra.heal ?? 0) || undefined,
  }
}

function replaceState(target: CombatState, source: CombatState): void {
  target.bestFloor = source.bestFloor
  target.builder = source.builder
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
    state.message = 'The Archivist broke your chain. Start a new run.'
    return
  }

  state.enemy.intentCursor =
    (state.enemy.intentCursor + 1) % state.enemy.intents.length
  state.player.block = 0
  state.builder = []
  state.player.energy = state.player.maxEnergy
  state.turn += 1
  drawCards(state, HAND_SIZE)
  state.message = `${state.enemy.label} acted. Assemble the next chain.`
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
