import type {
  Card,
  CardDefinition,
  CardEffect,
  CardInstance,
  HpRewardOption,
  Relic,
  RewardPhase,
  Sprite,
} from '.'

export type ModifierKind =
  | 'double'
  | 'echo'
  | 'heat'
  | 'heavy'
  | 'leech'
  | 'pierce'
  | 'quick'
  | 'risky'
  | 'safe'
  | 'stun'
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
  sprite: Sprite
  stunned: number
}

export interface PlayerState {
  block: number
  energy: number
  health: number
  maxEnergy: number
  maxHealth: number
}

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
  relicRewardOptions: Relic[]
  relics: Relic[]
  removeRewardOptions: CardInstance[]
  rewardPhase: RewardPhase
  upgradeRewardOptions: CardInstance[]
  status: 'lost' | 'playerTurn' | 'reward' | 'won'
  turn: number
}
