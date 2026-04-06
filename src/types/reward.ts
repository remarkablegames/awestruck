export type HpRewardType = 'fullHeal' | 'maxHp'

export interface HpRewardOption {
  type: HpRewardType
  label: string
}

export type RewardPhase = 'card' | 'hp' | 'relic' | 'remove' | 'upgrade'
