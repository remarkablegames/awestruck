export interface CardEffect {
  block?: number
  burn?: number
  damage?: number
  draw?: number
  energy?: number
  heal?: number
  ignoreBlock?: boolean
  selfDamage?: number
}

export type CardTag = 'flame' | 'growth' | 'guard' | 'thorn'

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

export interface CardDefinition {
  accent: [number, number, number]
  cost: number
  description: string
  effect: CardEffect
  id: string
  label: string
  modifier?: ModifierDefinition
  tags: CardTag[]
  type: 'modifier' | 'payload'
}

export interface CardInstance {
  cardId: string
  instanceId: string
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
  deckList: CardInstance[]
  discardPile: CardInstance[]
  drawPile: CardInstance[]
  enemy: EnemyState
  floor: number
  hand: CardInstance[]
  message: string
  nextInstanceId: number
  player: PlayerState
  rewardOptions: string[]
  status: 'lost' | 'playerTurn' | 'reward' | 'won'
  turn: number
}
