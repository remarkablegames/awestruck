import { CARDS, RELICS, REWARDS } from '../constants'
import type {
  Card,
  CardDefinition,
  CardInstance,
  CombatState,
  HpRewardOption,
  HpRewardType,
  RelicDefinition,
  RelicId,
} from '../types'
import {
  createCardInstance,
  createFloorState,
  getCardDefinition,
  getUpgradeCardId,
  replaceState,
  shuffle,
} from './core'

export function chooseHpReward(
  state: CombatState,
  rewardType: HpRewardType,
): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'hp') {
    return
  }

  switch (rewardType) {
    case REWARDS.FULL_HEAL:
      state.player.health = state.player.maxHealth
      break
    case 'maxHp':
      state.player.maxHealth += REWARDS.MAX_HP_INCREASE
      state.player.health = Math.min(
        state.player.maxHealth,
        state.player.health + REWARDS.MAX_HP_INCREASE,
      )
      break
  }

  advanceFromHpReward(state)
}

export function skipHpReward(state: CombatState): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'hp') {
    return
  }

  advanceFromHpReward(state)
}

export function chooseUpgradeReward(
  state: CombatState,
  instanceId: string,
): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'upgrade') {
    return
  }

  const option = state.upgradeRewardOptions.find(
    (card) => card.instanceId === instanceId,
  )

  if (!option) {
    return
  }

  const upgradeCardId = getUpgradeCardId(option.cardId)

  if (!upgradeCardId) {
    advanceToCardReward(state)
    return
  }

  const deckCard = state.deckList.find((card) => card.instanceId === instanceId)

  if (!deckCard) {
    advanceToCardReward(state)
    return
  }

  deckCard.cardId = upgradeCardId
  advanceToCardReward(state)
}

export function skipUpgradeReward(state: CombatState): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'upgrade') {
    return
  }

  advanceToCardReward(state)
}

export function chooseRelicReward(state: CombatState, relicId: RelicId): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'relic') {
    return
  }

  if (
    !state.relicRewardOptions.includes(relicId) ||
    state.relics.includes(relicId)
  ) {
    return
  }

  state.relics.push(relicId)
  advanceFromRelicReward(state)
}

export function skipRelicReward(state: CombatState): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'relic') {
    return
  }

  state.message = 'You ignore the relic reward.'
  advanceFromRelicReward(state)
}

export function chooseCardReward(state: CombatState, cardId: Card): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'card') {
    return
  }

  const rewardCard = createCardInstance(cardId, state.nextInstanceId)
  state.nextInstanceId += 1
  state.deckList.push(rewardCard)

  advanceFromReward(state)
  setCardRewardArrivalMessage(state, cardId)
}

export function skipCardReward(state: CombatState): void {
  if (state.status !== 'reward' || state.rewardPhase !== 'card') {
    return
  }

  state.message = 'You decline the card reward.'
  advanceFromReward(state)
}

export function getCardRewardDefinitions(state: CombatState): CardDefinition[] {
  return state.cardRewardOptions.map((cardId) => getCardDefinition(cardId))
}

export function getHpRewardOptions(state: CombatState): HpRewardOption[] {
  return state.hpRewardOptions
}

export function getRelicRewardDefinitions(
  state: CombatState,
): RelicDefinition[] {
  return state.relicRewardOptions.map(
    (relicId) => RELICS.RELIC_DEFINITIONS[relicId],
  )
}

export function getUpgradeRewardDefinitions(state: CombatState): {
  definition: CardDefinition
  instanceId: string
}[] {
  return state.upgradeRewardOptions.flatMap((card) => {
    const upgradedCardId = getUpgradeCardId(card.cardId)

    if (!upgradedCardId) {
      return []
    }

    return [
      {
        definition: getCardDefinition(upgradedCardId),
        instanceId: card.instanceId,
      },
    ]
  })
}

export function initializeRewardState(state: CombatState): void {
  state.status = 'reward'
  state.rewardPhase = 'hp'
  state.player.block = 0
  state.hpRewardOptions = createHpRewardOptions()
  state.cardRewardOptions = []
  state.relicRewardOptions = []
  state.upgradeRewardOptions = []
  state.message = 'Choose a vitality reward before improving a card.'
}

function drawRewardOptions(floor: number): Card[] {
  const rewardCards = REWARDS.REWARD_DEFINITIONS[floor - 1]?.cards ?? []
  return shuffle([...rewardCards]).slice(0, 3)
}

function drawUpgradeRewardOptions(deckList: CardInstance[]): CardInstance[] {
  return shuffle(
    deckList.filter((card) => Boolean(getUpgradeCardId(card.cardId))),
  ).slice(0, 3)
}

function createHpRewardOptions(): HpRewardOption[] {
  return [
    {
      type: REWARDS.FULL_HEAL,
      label: 'Full Heal',
    },
    {
      type: 'maxHp',
      label: `+${String(REWARDS.MAX_HP_INCREASE)} Max HP`,
    },
  ]
}

function createRelicRewardOptions(floor: number): RelicId[] {
  if (floor !== RELICS.RELIC_FLOOR) {
    return []
  }

  return REWARDS.REWARD_DEFINITIONS[floor - 1]?.relics ?? []
}

function advanceFromHpReward(state: CombatState): void {
  if (shouldOfferRelicReward(state.floor)) {
    advanceToRelicReward(state)
    return
  }

  if (shouldOfferUpgradeReward(state.floor)) {
    advanceToUpgradeReward(state)
    return
  }

  advanceToCardReward(state)
}

function advanceFromRelicReward(state: CombatState): void {
  if (shouldOfferUpgradeReward(state.floor)) {
    advanceToUpgradeReward(state)
    return
  }

  advanceToCardReward(state)
}

function advanceToRelicReward(state: CombatState): void {
  state.rewardPhase = 'relic'
  state.hpRewardOptions = []
  state.relicRewardOptions = createRelicRewardOptions(state.floor).filter(
    (relicId) => !state.relics.includes(relicId),
  )
  state.upgradeRewardOptions = []

  if (!state.relicRewardOptions.length) {
    advanceFromRelicReward(state)
    return
  }

  state.message = 'Choose a relic before improving a card.'
}

function advanceToUpgradeReward(state: CombatState): void {
  state.rewardPhase = 'upgrade'
  state.hpRewardOptions = []
  state.relicRewardOptions = []
  state.upgradeRewardOptions = drawUpgradeRewardOptions(state.deckList)

  if (!state.upgradeRewardOptions.length) {
    advanceToCardReward(state)
    return
  }

  state.message = 'Choose a card from your deck to upgrade.'
}

function advanceToCardReward(state: CombatState): void {
  state.rewardPhase = 'card'
  state.hpRewardOptions = []
  state.relicRewardOptions = []
  state.upgradeRewardOptions = []
  state.cardRewardOptions = drawRewardOptions(state.floor)
  state.message = 'Choose a new card reward before entering the next floor.'
}

function advanceFromReward(state: CombatState): void {
  const nextFloor = state.floor + 1
  const nextState = createFloorState({
    bestFloor: state.bestFloor,
    deckList: state.deckList,
    floor: nextFloor,
    handSize: state.handSize,
    nextInstanceId: state.nextInstanceId,
    playerHealth: state.player.health,
    playerMaxHealth: state.player.maxHealth,
    relics: state.relics,
  })

  replaceState(state, nextState)
}

function shouldOfferUpgradeReward(floor: number): boolean {
  return floor % 2 === 0
}

function shouldOfferRelicReward(floor: number): boolean {
  return floor === RELICS.RELIC_FLOOR
}

function setCardRewardArrivalMessage(state: CombatState, cardId: Card): void {
  if (state.status !== 'playerTurn') {
    return
  }

  state.message = `${CARDS.CARD_DEFINITIONS[cardId].label} joins the deck for floor ${String(state.floor)}.`
}
