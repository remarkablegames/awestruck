import type { WordDefinition } from '../types'

export const WORD_DEFINITIONS: WordDefinition[] = [
  {
    description: 'Deal 6 damage and apply 2 burn.',
    effect: {
      burn: 2,
      damage: 6,
    },
    id: 'ember',
    label: 'EMBER',
    sequence: ['em', 'ber'],
  },
  {
    description: 'Deal 8 damage.',
    effect: {
      damage: 8,
    },
    id: 'thorn',
    label: 'THORN',
    sequence: ['th', 'orn'],
  },
  {
    description: 'Deal 5 damage and draw 1 card.',
    effect: {
      damage: 5,
      draw: 1,
    },
    id: 'spark',
    label: 'SPARK',
    sequence: ['sp', 'ark'],
  },
  {
    description: 'Gain 7 block and heal 2.',
    effect: {
      block: 7,
      heal: 2,
    },
    id: 'bloom',
    label: 'BLOOM',
    sequence: ['bl', 'oom'],
  },
]
