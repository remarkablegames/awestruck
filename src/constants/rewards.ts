import type { Card } from '../types'

interface RewardDefinition {
  cards: Card[]
}

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  // floor 1
  {
    cards: ['sear1', 'pierce1', 'ward1', 'wilt1'],
  },

  // floor 2
  {
    cards: ['bastion1', 'heavy1', 'embered1', 'leech1', 'double1'],
  },

  // floor 3
  {
    cards: ['rage1', 'risky1', 'echo1', 'charge1'],
  },
]

export const FULL_HEAL = 'fullHeal'
export const MAX_HP_INCREASE = 5
export const MAX_REWARD_FLOOR = REWARD_DEFINITIONS.length
