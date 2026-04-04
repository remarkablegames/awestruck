import type { Card } from '../types'

interface RewardDefinition {
  rewardPool: Card[]
}

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  // floor 1
  {
    rewardPool: ['sear', 'pierce', 'ward', 'wilt'],
  },

  // floor 2
  {
    rewardPool: ['bastion', 'heavy', 'embered', 'leech', 'double'],
  },

  // floor 3
  {
    rewardPool: ['rage', 'risky', 'echo', 'charge'],
  },
]

export const MAX_REWARD_FLOOR = REWARD_DEFINITIONS.length
