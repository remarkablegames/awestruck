import type { Card, HpRewardType, Relic } from '../types'

export const FULL_HEAL = 'fullHeal'
export const MAX_HP = 'maxHp'
export const MAX_HP_INCREASE = 5

interface RewardDefinition {
  cards: Card[]
  relics?: Relic[]
  stats?: HpRewardType[]
}

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  // floor 1
  {
    cards: ['sear1', 'pierce1', 'ward1', 'wilt1'],
  },

  // floor 2
  {
    cards: ['bastion1', 'heavy1', 'heat1', 'leech1', 'double1'],
  },

  // floor 3
  {
    cards: ['rage1', 'risky1', 'echo1', 'charge1', 'focus1'],
  },

  // floor 4
  {
    cards: ['shield2', 'surge2', 'thorn2', 'safe1', 'focus2'],
    relics: ['aegis', 'guardian', 'overdrive'],
    stats: [FULL_HEAL, MAX_HP],
  },

  // floor 5
  {
    cards: ['bloom2', 'burn2', 'quick2', 'wide2', 'ward2'],
  },

  // floor 6
  {
    cards: ['bastion2', 'heavy2', 'leech2', 'double2', 'heat2'],
  },

  // floor 7
  {
    cards: ['charge2', 'echo2', 'rage2', 'risky2', 'surge2'],
  },
]

export const MAX_REWARD_FLOOR = REWARD_DEFINITIONS.length
