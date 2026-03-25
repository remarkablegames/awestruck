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
    enemyMaxHealth: 24,
    enemySprite: SPRITE.SOLDIER,
  },

  // floor 2
  {
    enemyIntents: [
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
    enemyMaxHealth: 32,
    enemySprite: SPRITE.ARCHER,
  },

  // floor 3
  {
    enemyIntents: [
      {
        attack: 9,
        description: 'Strike for 9 damage.',
        id: 'snap',
        label: 'SNAP',
      },
      {
        block: 8,
        description: 'Gain 8 block.',
        id: 'molt',
        label: 'MOLT',
      },
      {
        attack: 11,
        description: 'Strike for 11 damage.',
        id: 'talon',
        label: 'TALON',
      },
    ],
    enemyMaxHealth: 36,
    enemySprite: SPRITE.HATCHLING,
  },

  // floor 4
  {
    enemyIntents: [
      {
        attack: 12,
        description: 'Strike for 12 damage.',
        id: 'cleave',
        label: 'CLEAVE',
      },
      {
        block: 10,
        description: 'Gain 10 block.',
        id: 'shell',
        label: 'SHELL',
      },
      {
        attack: 14,
        description: 'Strike for 14 damage.',
        id: 'ruin',
        label: 'RUIN',
      },
    ],
    enemyMaxHealth: 46,
    enemySprite: SPRITE.REAVER,
  },
]

export const MAX_FLOOR = FLOOR_DEFINITIONS.length
