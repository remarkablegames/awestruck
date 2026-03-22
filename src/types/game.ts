export interface CardEffect {
  block?: number
  burn?: number
  damage?: number
  draw?: number
  heal?: number
}

export interface CardDefinition {
  accent: [number, number, number]
  cost: number
  description: string
  effect: CardEffect
  id: string
  label: string
  type: 'fragment' | 'utility'
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

export interface WordDefinition {
  description: string
  effect: CardEffect
  id: string
  label: string
  sequence: string[]
}

export type WordResolution =
  | {
      status: 'building'
      word?: undefined
    }
  | {
      status: 'empty'
      word?: undefined
    }
  | {
      status: 'invalid'
      word?: undefined
    }
  | {
      status: 'ready'
      word: WordDefinition
    }

export interface CombatState {
  bestFloor: number
  builder: CardInstance[]
  confirmedWordThisTurn: boolean
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
