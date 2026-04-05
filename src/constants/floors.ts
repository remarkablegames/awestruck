import type { EnemyIntent, Sprite } from '../types'
import * as SPRITE from './sprite'

interface FloorDefinition {
  enemyName: string
  enemyIntents: EnemyIntent[]
  enemyMaxHealth: number
  enemySprite: Sprite
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

  // floor 5
  {
    enemyName: 'Hatchling',
    enemyIntents: [
      {
        block: 9,
        description: 'Harden and gain 9 block.',
        id: 'harden',
        label: 'DEFEND',
      },
      {
        block: 11,
        description: 'Brace and gain 11 block.',
        id: 'brace',
        label: 'DEFEND',
      },
      {
        attack: 5,
        block: 8,
        description: 'Ram through for 5 damage and 8 block.',
        id: 'ram',
        label: 'PRESSURE',
      },
      {
        block: 7,
        description: 'Coil up and gain 7 block.',
        id: 'coil',
        label: 'DEFEND',
      },
      {
        attack: 18,
        description: 'Unleash a crushing slam for 18 damage.',
        id: 'crushing-slam',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 42,
    enemySprite: SPRITE.HATCHLING,
  },

  // floor 6
  {
    enemyName: 'Soldier',
    enemyIntents: [
      {
        attack: 10,
        description: 'Bite for 10 damage.',
        id: 'bite',
        label: 'ATTACK',
      },
      {
        attack: 12,
        description: 'Lunge for 12 damage.',
        id: 'lunge',
        label: 'ATTACK',
      },
      {
        attack: 8,
        description: 'Jab for 8 damage.',
        id: 'jab',
        label: 'ATTACK',
      },
      {
        attack: 11,
        block: 5,
        description: 'Crush for 11 damage and gain 5 block.',
        id: 'crush',
        label: 'ASSAULT',
      },
    ],
    enemyMaxHealth: 50,
    enemySprite: SPRITE.SOLDIER,
  },

  // floor 7
  {
    enemyName: 'Archer',
    enemyIntents: [
      {
        attack: 13,
        description: 'Spray acid for 13 damage.',
        id: 'acid-spray',
        label: 'ATTACK',
      },
      {
        block: 10,
        description: 'Guard for 10 block.',
        id: 'guard',
        label: 'DEFEND',
      },
      {
        attack: 10,
        block: 8,
        description: 'Advance with 10 damage and 8 block.',
        id: 'advance',
        label: 'PRESSURE',
      },
      {
        attack: 15,
        description: 'Discharge a corrosive volley for 15 damage.',
        id: 'discharge',
        label: 'ATTACK',
      },
    ],
    enemyMaxHealth: 60,
    enemySprite: SPRITE.ARCHER,
  },

  // floor 8
  {
    enemyName: 'Reaver',
    enemyIntents: [
      {
        description: 'The enemy is thinking...',
        id: 'thinking',
        label: 'THINK',
      },
      {
        attack: 16,
        description: 'Slice for 16 damage.',
        id: 'slice',
        label: 'ATTACK',
      },
      {
        block: 12,
        description: 'Fortify and gain 12 block.',
        id: 'fortify',
        label: 'DEFEND',
      },
      {
        attack: 11,
        block: 9,
        description: 'Advance with 11 damage and 9 block.',
        id: 'advance',
        label: 'PRESSURE',
      },
      {
        attack: 18,
        description: 'Tear for 18 damage.',
        id: 'tear',
        label: 'ATTACK',
      },
      {
        attack: 13,
        block: 7,
        description: 'Relentlessly strike for 13 damage and 7 block.',
        id: 'relentless',
        label: 'ASSAULT',
      },
    ],
    enemyMaxHealth: 74,
    enemySprite: SPRITE.REAVER,
  },
]

export const MAX_FLOOR = FLOOR_DEFINITIONS.length
