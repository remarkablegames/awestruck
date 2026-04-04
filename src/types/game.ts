import type { Card, CardDefinition, CardEffect, CardInstance } from '.'

export type ModifierKind =
  | 'double'
  | 'echo'
  | 'embered'
  | 'heavy'
  | 'leech'
  | 'pierce'
  | 'quick'
  | 'risky'
  | 'safe'
  | 'wide'

export interface ModifierDefinition {
  kind: ModifierKind
}

export interface EnemyIntent {
  attack?: number
  block?: number
  description: string
  id: string
  label: string
}

export interface EnemyState {
  block: number
  burn: number
  health: number
  intentCursor: number
  intents: EnemyIntent[]
  label: string
  maxHealth: number
  sprite: string
}

export interface PlayerState {
  block: number
  energy: number
  health: number
  maxEnergy: number
  maxHealth: number
}

export type HpRewardKind = 'fullHeal' | 'maxHP'

export interface HpRewardOption {
  kind: HpRewardKind
  label: string
}

export type RewardPhase = 'card' | 'hp'

export type ChainPreview =
  | {
      cost: number
      previewText: string
      status: 'building'
    }
  | {
      cost: number
      previewText: string
      status: 'empty'
    }
  | {
      cost: number
      previewText: string
      status: 'invalid'
    }
  | {
      cost: number
      effect: CardEffect
      payload: CardDefinition
      previewText: string
      status: 'ready'
    }

export interface CombatState {
  bestFloor: number
  builder: CardInstance[]
  cardRewardOptions: Card[]
  deckList: CardInstance[]
  discardPile: CardInstance[]
  drawPile: CardInstance[]
  enemy: EnemyState
  floor: number
  hand: CardInstance[]
  handSize: number
  hpRewardOptions: HpRewardOption[]
  message: string
  nextInstanceId: number
  player: PlayerState
  rewardPhase: RewardPhase
  status: 'lost' | 'playerTurn' | 'reward' | 'won'
  turn: number
}
