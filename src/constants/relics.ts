import type { Relic, RelicDefinition } from '../types'

export const RELIC_FLOOR = 4

export const RELIC_DEFINITIONS: Record<Relic, RelicDefinition> = {
  aegis: {
    description: 'Retain 50% of your block each turn.',
    id: 'aegis',
    label: 'AEGIS',
  },
  guardian: {
    description: 'Heal 3 and gain 3 block.',
    id: 'guardian',
    label: 'GUARDIAN',
  },
  overdrive: {
    description: 'Gain 1 energy, lose 1 HP, draw 1 less card.',
    id: 'overdrive',
    label: 'OVERDRIVE',
  },
}
