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
    enemyName: 'Hatchling',
    enemyIntents: [
      {
        attack: 5,
        description: 'Tackle for 5 damage.',
        id: 'tackle',
        label: 'ATTACK',
      },
      {
        block: 5,
        description: 'Harden and gain 5 block.',
        id: 'harden',
        label: 'DEFEND',
      },
      {
        attack: 4,
        block: 3,
        description: 'Ram through for 4 damage and 3 block.',
        id: 'ram',
        label: 'PRESSURE',
      },
      {
        attack: 7,
        description: 'Slam for 7 damage.',
        id: 'slam',
        label: 'ATTACK',
      },
      {
        attack: 6,
        description: 'Snap for 6 damage.',
        id: 'snap',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 28,
    enemySprite: SPRITE.HATCHLING,
  },

  // floor 2
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
        attack: 8,
        description: 'Lunge for 8 damage.',
        id: 'lunge',
        label: 'ATTACK',
      },
      {
        attack: 6,
        description: 'Jab for 6 damage.',
        id: 'jab',
        label: 'ATTACK',
      },
      {
        attack: 9,
        description: 'Crush for 9 damage.',
        id: 'crush',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 36,
    enemySprite: SPRITE.SOLDIER,
  },

  // floor 3
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
        attack: 8,
        block: 6,
        description: 'Advance with 8 damage and 6 block.',
        id: 'advance',
        label: 'PRESSURE',
      },
      {
        attack: 12,
        description: 'Discharge a corrosive volley for 12 damage.',
        id: 'discharge',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 44,
    enemySprite: SPRITE.ARCHER,
  },

  // floor 4
  {
    enemyName: 'Reaver',
    enemyIntents: [
      {
        attack: 13,
        description: 'Slice for 13 damage.',
        id: 'slice',
        label: 'ATTACK',
      },
      {
        block: 10,
        description: 'Fortify and gain 10 block.',
        id: 'fortify',
        label: 'DEFEND',
      },
      {
        attack: 8,
        block: 7,
        description: 'Advance with 8 damage and 7 block.',
        id: 'advance',
        label: 'PRESSURE',
      },
      {
        attack: 15,
        description: 'Tear for 15 damage.',
        id: 'tear',
        label: 'ATTACK',
      },
      {
        attack: 10,
        block: 5,
        description: 'Relentlessly strike for 10 damage and 5 block.',
        id: 'relentless',
        label: 'ASSAULT',
      },
    ],
    enemyMaxHealth: 58,
    enemySprite: SPRITE.REAVER,
  },
]

export const MAX_FLOOR = FLOOR_DEFINITIONS.length
