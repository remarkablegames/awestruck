import type { RunConfig } from '../config'
import { COMBAT, FLOORS } from '../constants'
import type {
  CardEffect,
  CardInstance,
  ChainPreview,
  CombatState,
  ModifierKind,
} from '../types'
import {
  createFloorState,
  dealDamageToPlayer,
  drawCards,
  getCardDefinition,
  startPlayerTurn,
} from './core'
import { initializeRewardState } from './rewards'

export function getChainPreview(builder: CardInstance[]): ChainPreview {
  const cost = getChainCost(builder)

  if (!builder.length) {
    return {
      cost,
      previewText: 'Build a modifier chain or play a payload alone.',
      status: 'empty',
    }
  }

  const definitions = builder.map((card) => getCardDefinition(card.cardId))
  const payloadCards = definitions.filter((card) => card.type === 'payload')

  if (!payloadCards.length) {
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
    previewText: `${payload.label} → ${formatEffect(effect)}`,
    status: 'ready',
  }
}

export function createInitialState(
  bestFloor: number,
  runConfig: RunConfig,
): CombatState {
  const deckList = runConfig.startingDeck.map((cardId, index) => ({
    cardId,
    instanceId: `card-${String(index)}`,
  }))

  const state = createFloorState({
    bestFloor,
    deckList,
    floor: runConfig.startingFloor,
    handSize: runConfig.startingHandSize,
    nextInstanceId: deckList.length,
    playerHealth: COMBAT.PLAYER_MAX_HEALTH,
    playerMaxHealth: COMBAT.PLAYER_MAX_HEALTH,
    relics: [],
  })

  if (runConfig.startingRewardFloor) {
    initializeRewardState(state)
  }

  return state
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
  const disabledReason = getCardCommitDisabledReason(state, card)

  if (disabledReason) {
    state.message = disabledReason
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

export function getCardCommitDisabledReason(
  state: CombatState,
  card: CardInstance,
): string | null {
  if (state.status !== 'playerTurn') {
    return 'You can only commit cards during your turn.'
  }

  const definition = getCardDefinition(card.cardId)

  if (state.player.energy < definition.cost) {
    return 'Not enough energy to commit this card.'
  }

  if (hasPayloadCard(state.builder)) {
    return 'Resolve or cancel the current payload chain first.'
  }

  return null
}

export function cancelBuilder(state: CombatState): void {
  if (state.status !== 'playerTurn' || !state.builder.length) {
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

  if (state.builder.length) {
    state.message =
      'Execute or cancel the current chain before ending the turn.'
    return
  }

  state.discardPile.push(...state.hand)
  state.hand = []

  runEnemyTurn(state)
}

export function getDeckCountLabel(state: CombatState): string {
  return String(state.deckList.length)
}

function applyCardEffect(state: CombatState, effect: CardEffect): boolean {
  if (effect.damage) {
    dealDamageToEnemy(state, effect.damage, effect.ignoreBlock)
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

  if (effect.energy) {
    state.player.energy += effect.energy
  }

  if (effect.selfDamage) {
    dealDamageToPlayer(state, effect.selfDamage, effect.selfDamageIgnoresBlock)
  }

  if (state.enemy.health <= 0) {
    handleEnemyDefeat(state)
    return true
  }

  if (state.player.health <= 0) {
    state.status = 'lost'
    state.message = 'You overextended the chain and collapsed.'
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
        mapEffect(effect, (value) => Math.floor(value / 2)),
      )
    case 'heat':
      return mergeEffects(effect, {
        burn: 3,
      })
    case 'heavy':
      return mergeEffects(effect, {
        block: hasDefense(effect) ? 5 : undefined,
        burn: effect.burn ? 2 : undefined,
        damage: effect.damage ? 3 : undefined,
        heal: effect.heal ? 1 : undefined,
      })
    case 'leech':
      return mergeEffects(effect, {
        heal: effect.damage ? Math.ceil(effect.damage / 2) : undefined,
      })
    case 'pierce':
      return effect.damage
        ? {
            ...effect,
            ignoreBlock: true,
          }
        : effect
    case 'quick':
      return mergeEffects(effect, {
        damage: hasOffense(effect) ? 1 : undefined,
        block: hasDefense(effect) ? 2 : undefined,
        draw: 1,
      })
    case 'risky':
      return mergeEffects(
        {
          ...effect,
          selfDamage: (effect.selfDamage ?? 0) + 2,
        },
        {
          block: hasDefense(effect) ? 4 : undefined,
          burn: effect.burn ? 2 : undefined,
          damage: effect.damage ? 4 : undefined,
          draw: 1,
          heal: effect.heal ? 1 : undefined,
        },
      )
    case 'safe':
      return mergeEffects(effect, {
        block: 3,
      })
    case 'wide':
      return mergeEffects(effect, {
        block: hasDefense(effect) ? 3 : undefined,
        burn: hasOffense(effect) ? 1 : undefined,
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
    energy: effect.energy,
    heal: effect.heal,
    ignoreBlock: effect.ignoreBlock,
    selfDamageIgnoresBlock: effect.selfDamageIgnoresBlock,
    selfDamage: effect.selfDamage,
  }
}

function dealDamageToEnemy(
  state: CombatState,
  amount: number,
  ignoreBlock = false,
): void {
  if (ignoreBlock) {
    state.enemy.health = Math.max(0, state.enemy.health - amount)
    return
  }

  const blocked = Math.min(state.enemy.block, amount)
  const overflow = amount - blocked

  state.enemy.block -= blocked
  state.enemy.health = Math.max(0, state.enemy.health - overflow)
}

function formatEffect(effect: CardEffect): string {
  const parts: string[] = []

  if (effect.damage) {
    parts.push(`deal ${String(effect.damage)} damage`)
  }

  if (effect.burn) {
    parts.push(`apply ${String(effect.burn)} burn`)
  }

  if (effect.block) {
    parts.push(`gain ${String(effect.block)} block`)
  }

  if (effect.heal) {
    parts.push(`heal ${String(effect.heal)}`)
  }

  if (effect.draw) {
    parts.push(`draw ${String(effect.draw)}`)
  }

  if (effect.energy) {
    parts.push(`gain ${String(effect.energy)} energy`)
  }

  if (effect.ignoreBlock) {
    parts.push('ignore block')
  }

  if (effect.selfDamage) {
    parts.push(`take ${String(effect.selfDamage)} damage`)
  }

  if (effect.selfDamageIgnoresBlock) {
    parts.push('ignore your block')
  }

  if (!parts.length) {
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

function hasPayloadCard(builder: CardInstance[]): boolean {
  return builder.some(
    (card) => getCardDefinition(card.cardId).type === 'payload',
  )
}

function handleEnemyDefeat(state: CombatState): void {
  if (state.floor >= FLOORS.MAX_FLOOR) {
    state.status = 'won'
    return
  }

  initializeRewardState(state)
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
    left.energy === right.energy &&
    left.heal === right.heal &&
    left.ignoreBlock === right.ignoreBlock &&
    left.selfDamageIgnoresBlock === right.selfDamageIgnoresBlock &&
    left.selfDamage === right.selfDamage
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
    energy: effect.energy ? mapper(effect.energy) : undefined,
    heal: effect.heal ? mapper(effect.heal) : undefined,
    ignoreBlock: effect.ignoreBlock,
    selfDamageIgnoresBlock: effect.selfDamageIgnoresBlock,
    selfDamage: effect.selfDamage,
  }
}

function mergeEffects(base: CardEffect, extra: CardEffect): CardEffect {
  return {
    block: (base.block ?? 0) + (extra.block ?? 0) || undefined,
    burn: (base.burn ?? 0) + (extra.burn ?? 0) || undefined,
    damage: (base.damage ?? 0) + (extra.damage ?? 0) || undefined,
    draw: (base.draw ?? 0) + (extra.draw ?? 0) || undefined,
    energy: (base.energy ?? 0) + (extra.energy ?? 0) || undefined,
    heal: (base.heal ?? 0) + (extra.heal ?? 0) || undefined,
    ignoreBlock:
      base.ignoreBlock === true || extra.ignoreBlock === true
        ? true
        : undefined,
    selfDamageIgnoresBlock:
      base.selfDamageIgnoresBlock === true ||
      extra.selfDamageIgnoresBlock === true
        ? true
        : undefined,
    selfDamage: (base.selfDamage ?? 0) + (extra.selfDamage ?? 0) || undefined,
  }
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
    return
  }

  state.enemy.intentCursor =
    (state.enemy.intentCursor + 1) % state.enemy.intents.length
  state.player.block = 0
  state.builder = []
  state.turn += 1
  startPlayerTurn(state)

  if (state.status === 'lost') {
    return
  }

  state.message = `${state.enemy.label} acted. Assemble the next chain.`
}
