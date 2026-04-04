import type { Card } from '../types'

interface RewardDefinition {
  cards: Card[]
}

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  // floor 1
  {
    cards: ['sear', 'pierce', 'ward', 'wilt'],
  },

  // floor 2
  {
    cards: ['bastion', 'heavy', 'embered', 'leech', 'double'],
  },

  // floor 3
  {
    cards: ['rage', 'risky', 'echo', 'charge'],
  },
]

export const FULL_HEAL = 'fullHeal'
export const MAX_HP_INCREASE = 5
export const MAX_REWARD_FLOOR = REWARD_DEFINITIONS.length
