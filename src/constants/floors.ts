import type { EnemyIntent } from '../types'
import * as SPRITE from './sprite'

interface FloorDefinition {
  enemyIntents: EnemyIntent[]
  enemyMaxHealth: number
  enemySprite: string
}

export const FLOOR_DEFINITIONS: FloorDefinition[] = [
  // floor 1
  {
    enemyIntents: [
      {
        attack: 7,
        description: 'Strike for 7 damage.',
        id: 'jab',
        label: 'JAB',
      },
      {
        block: 6,
        description: 'Gain 6 block.',
        id: 'brace',
        label: 'BRACE',
      },
      {
        attack: 9,
        description: 'Strike for 9 damage.',
        id: 'slam',
        label: 'SLAM',
      },
    ],
    enemyMaxHealth: 28,
    enemySprite: SPRITE.SOLDIER,
  },

  // floor 2
  {
    enemyIntents: [
      {
        attack: 10,
        description: 'Strike for 10 damage.',
        id: 'lunge',
        label: 'LUNGE',
      },
      {
        block: 8,
        description: 'Gain 8 block.',
        id: 'fortify',
        label: 'FORTIFY',
      },
      {
        attack: 12,
        description: 'Strike for 12 damage.',
        id: 'crack',
        label: 'CRACK',
      },
    ],
    enemyMaxHealth: 36,
    enemySprite: SPRITE.ARCHER,
  },

  // floor 3
  {
    enemyIntents: [
      {
        attack: 11,
        description: 'Strike for 11 damage.',
        id: 'snap',
        label: 'SNAP',
      },
      {
        block: 9,
        description: 'Gain 9 block.',
        id: 'molt',
        label: 'MOLT',
      },
      {
        attack: 13,
        description: 'Strike for 13 damage.',
        id: 'talon',
        label: 'TALON',
      },
    ],
    enemyMaxHealth: 42,
    enemySprite: SPRITE.HATCHLING,
  },

  // floor 4
  {
    enemyIntents: [
      {
        attack: 14,
        description: 'Strike for 14 damage.',
        id: 'cleave',
        label: 'CLEAVE',
      },
      {
        block: 12,
        description: 'Gain 12 block.',
        id: 'shell',
        label: 'SHELL',
      },
      {
        attack: 16,
        description: 'Strike for 16 damage.',
        id: 'ruin',
        label: 'RUIN',
      },
    ],
    enemyMaxHealth: 54,
    enemySprite: SPRITE.REAVER,
  },
]

export const MAX_FLOOR = FLOOR_DEFINITIONS.length
