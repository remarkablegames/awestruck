import type { RelicDefinition, RelicId } from '../types'

export const RELIC_FLOOR = 4

export const RELIC_DEFINITIONS: Record<RelicId, RelicDefinition> = {
  overdrive: {
    description:
      'At the start of your turn, lose 1 HP, gain 1 energy, and draw 1 fewer card.',
    id: 'overdrive',
    label: 'OVERDRIVE',
  },
}
