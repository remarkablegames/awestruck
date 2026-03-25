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
    enemyMaxHealth: 40,
    enemySprite: SPRITE.REAVER,
  },
]
