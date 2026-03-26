import type { EnemyIntent } from '../types'
import * as SPRITE from './sprite'

interface FloorDefinition {
  enemyName: string
  enemyIntents: EnemyIntent[]
  enemyMaxHealth: number
  enemySprite: string
}

export const FLOOR_DEFINITIONS: FloorDefinition[] = [
  // floor 1
  {
    enemyName: 'Soldier',
    enemyIntents: [
      {
        attack: 7,
        description: 'Bite for 7 damage.',
        id: 'bite',
        label: 'ATTACK',
      },
      {
        block: 6,
        description: 'Brace for 6 block.',
        id: 'brace',
        label: 'DEFEND',
      },
      {
        attack: 9,
        description: 'Crush for 9 damage.',
        id: 'crush',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 28,
    enemySprite: SPRITE.SOLDIER,
  },

  // floor 2
  {
    enemyName: 'Archer',
    enemyIntents: [
      {
        attack: 10,
        description: 'Spray acid for 10 damage.',
        id: 'acid-spray',
        label: 'ATTACK',
      },
      {
        block: 8,
        description: 'Guard for 8 block.',
        id: 'guard',
        label: 'DEFEND',
      },
      {
        attack: 12,
        description: 'Discharge a corrosive volley for 12 damage.',
        id: 'discharge',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 36,
    enemySprite: SPRITE.ARCHER,
  },

  // floor 3
  {
    enemyName: 'Hatchling',
    enemyIntents: [
      {
        attack: 11,
        description: 'Tackle for 11 damage.',
        id: 'tackle',
        label: 'ATTACK',
      },
      {
        block: 9,
        description: 'Harden and gain 9 block.',
        id: 'harden',
        label: 'DEFEND',
      },
      {
        attack: 13,
        description: 'Slam for 13 damage.',
        id: 'slam',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 42,
    enemySprite: SPRITE.HATCHLING,
  },

  // floor 4
  {
    enemyName: 'Reaver',
    enemyIntents: [
      {
        attack: 14,
        description: 'Slice for 14 damage.',
        id: 'slice',
        label: 'ATTACK',
      },
      {
        block: 12,
        description: 'Shield and gain 12 block.',
        id: 'shield',
        label: 'DEFEND',
      },
      {
        attack: 16,
        description: 'Tear for 16 damage.',
        id: 'tear',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 54,
    enemySprite: SPRITE.REAVER,
  },
]

export const MAX_FLOOR = FLOOR_DEFINITIONS.length
