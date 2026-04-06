import type { Card, HpRewardType, Relic } from '../types'

export const FULL_HEAL = 'fullHeal'
export const MAX_HP = 'maxHp'
export const MAX_HP_INCREASE = 5

interface RewardDefinition {
  cards: Card[]
  relics?: Relic[]
  stats: HpRewardType[]
  upgrade?: boolean
}

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  // floor 1
  {
    cards: ['sear1', 'ward1', 'wilt1', 'leech1', 'heat1'],
    stats: [FULL_HEAL, MAX_HP],
  },

  // floor 2
  {
    cards: ['bastion1', 'heavy1', 'double1', 'pierce1', 'echo1'],
    stats: [FULL_HEAL, MAX_HP],
    upgrade: true,
  },

  // floor 3
  {
    cards: ['rage1', 'risky1', 'stun1', 'charge1', 'focus1'],
    stats: [FULL_HEAL, MAX_HP],
  },

  // floor 4
  {
    cards: ['shield2', 'surge2', 'thorn2', 'safe1', 'focus2'],
    relics: ['aegis', 'guardian', 'overdrive'],
    stats: [FULL_HEAL, MAX_HP],
    upgrade: true,
  },

  // floor 5
  {
    cards: ['bloom2', 'burn2', 'quick2', 'wide2', 'ward2'],
    stats: [FULL_HEAL, MAX_HP],
  },

  // floor 6
  {
    cards: ['bastion2', 'heavy2', 'leech2', 'double2', 'heat2'],
    stats: [FULL_HEAL, MAX_HP],
    upgrade: true,
  },

  // floor 7
  {
    cards: ['echo2', 'risky2', 'surge2', 'focus2', 'thorn2'],
    stats: [FULL_HEAL, MAX_HP],
  },
]

export const MAX_REWARD_FLOOR = REWARD_DEFINITIONS.length
