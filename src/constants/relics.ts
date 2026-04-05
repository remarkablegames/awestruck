import type { RelicDefinition, RelicId } from '../types'

export const RELIC_FLOOR = 4

export const RELIC_DEFINITIONS: Record<RelicId, RelicDefinition> = {
  guardian: {
    description: 'Heal 3 and gain 3 block.',
    id: 'guardian',
    label: 'GUARDIAN',
  },
  overdrive: {
    description: 'Gain 1 energy, lose 1 HP, decrease draw by 1',
    id: 'overdrive',
    label: 'OVERDRIVE',
  },
}
