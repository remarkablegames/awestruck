import { CARDS, COMBAT, FLOORS } from '../constants'
import type {
  Card,
  CardDefinition,
  CardInstance,
  CombatState,
  EnemyState,
  Relic,
} from '../types'

export function getCardDefinition(cardId: Card): CardDefinition {
  return CARDS.CARD_DEFINITIONS[cardId]
}

export function createCardInstance(cardId: Card, index: number): CardInstance {
  return {
    cardId,
    instanceId: `card-${String(index)}`,
  }
}

export function createFloorState({
  bestFloor,
  deckList,
  floor,
  handSize,
  nextInstanceId,
  playerHealth,
  playerMaxHealth,
  relics,
}: {
  bestFloor: number
  deckList: CardInstance[]
  floor: number
  handSize: number
  nextInstanceId: number
  playerHealth: number
  playerMaxHealth: number
  relics: Relic[]
}): CombatState {
  const state: CombatState = {
    bestFloor: Math.max(bestFloor, floor),
    builder: [],
    cardRewardOptions: [],
    deckList,
    discardPile: [],
    drawPile: shuffle([...deckList]),
    enemy: createEnemyState(floor),
    floor,
    hand: [],
    handSize,
    hpRewardOptions: [],
    message: `Floor ${String(floor)} begins. Build a modifier chain or play a payload alone.`,
    nextInstanceId,
    player: {
      block: 0,
      energy: 0,
      health: playerHealth,
      maxEnergy: COMBAT.MAX_ENERGY,
      maxHealth: playerMaxHealth,
    },
    relicRewardOptions: [],
    relics: [...relics],
    removeRewardOptions: [],
    rewardPhase: 'card',
    status: 'playerTurn',
    turn: 1,
    upgradeRewardOptions: [],
  }

  startPlayerTurn(state)

  return state
}

export function dealDamageToPlayer(
  state: CombatState,
  amount: number,
  ignoreBlock = false,
): void {
  if (ignoreBlock) {
    state.player.health = Math.max(0, state.player.health - amount)
    return
  }

  const blocked = Math.min(state.player.block, amount)
  const overflow = amount - blocked

  state.player.block -= blocked
  state.player.health = Math.max(0, state.player.health - overflow)
}

export function drawCards(state: CombatState, count: number): void {
  for (let index = 0; index < count; index += 1) {
    if (!state.drawPile.length) {
      if (!state.discardPile.length) {
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

export function replaceState(target: CombatState, source: CombatState): void {
  target.bestFloor = source.bestFloor
  target.builder = source.builder
  target.cardRewardOptions = source.cardRewardOptions
  target.deckList = source.deckList
  target.discardPile = source.discardPile
  target.drawPile = source.drawPile
  target.enemy = source.enemy
  target.floor = source.floor
  target.hand = source.hand
  target.handSize = source.handSize
  target.hpRewardOptions = source.hpRewardOptions
  target.message = source.message
  target.nextInstanceId = source.nextInstanceId
  target.player = source.player
  target.relicRewardOptions = source.relicRewardOptions
  target.relics = source.relics
  target.removeRewardOptions = source.removeRewardOptions
  target.rewardPhase = source.rewardPhase
  target.status = source.status
  target.turn = source.turn
  target.upgradeRewardOptions = source.upgradeRewardOptions
}

export function getUpgradeCardId(cardId: Card): Card | null {
  const upgradeCardId = getCardDefinition(cardId).upgrade

  if (!upgradeCardId || !(upgradeCardId in CARDS.CARD_DEFINITIONS)) {
    return null
  }

  return upgradeCardId as Card
}

export function startPlayerTurn(state: CombatState): void {
  if (state.relics.includes('overdrive')) {
    dealDamageToPlayer(state, 1, true)

    if (state.player.health <= 0) {
      state.status = 'lost'
      state.message = 'Overdrive burned through the last of your vitality.'
      return
    }
  }

  if (state.relics.includes('guardian')) {
    state.player.health = Math.min(
      state.player.maxHealth,
      state.player.health + 1,
    )
    state.player.block += 2
  }

  state.player.energy = state.player.maxEnergy + getTurnStartEnergyBonus(state)
  drawCards(state, getTurnStartDrawCount(state))
}

export function shuffle<Value>(items: Value[]): Value[] {
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

function createEnemyState(floor: number): EnemyState {
  const floorDefinition =
    FLOORS.FLOOR_DEFINITIONS[
      Math.min(floor - 1, FLOORS.FLOOR_DEFINITIONS.length - 1)
    ]

  return {
    block: 0,
    burn: 0,
    health: floorDefinition.enemyMaxHealth,
    intentCursor: 0,
    intents: floorDefinition.enemyIntents,
    label: floorDefinition.enemyName,
    maxHealth: floorDefinition.enemyMaxHealth,
    sprite: floorDefinition.enemySprite,
    stunned: 0,
  }
}

function getTurnStartDrawCount(state: CombatState): number {
  const reduction = state.relics.includes('overdrive') ? 1 : 0
  const bonus = state.relics.includes('aegis') ? 1 : 0
  return Math.max(0, state.handSize - reduction + bonus)
}

function getTurnStartEnergyBonus(state: CombatState): number {
  return state.relics.includes('overdrive') ? 1 : 0
}
