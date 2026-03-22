import type { CardDefinition } from '../types'

export const CARD_DEFINITIONS: Record<string, CardDefinition> = {
  barrier: {
    accent: [134, 177, 255],
    cost: 1,
    description: 'Gain 9 block.',
    effect: {
      block: 9,
    },
    id: 'barrier',
    label: 'BARRIER',
    tags: ['guard'],
    type: 'utility',
  },
  bloom: {
    accent: [129, 210, 141],
    cost: 1,
    description: 'Gain 6 block and heal 3.',
    effect: {
      block: 6,
      heal: 3,
    },
    id: 'bloom',
    label: 'BLOOM',
    tags: ['growth'],
    type: 'payload',
  },
  burn: {
    accent: [255, 118, 74],
    cost: 1,
    description: 'Deal 5 damage and apply 2 burn.',
    effect: {
      burn: 2,
      damage: 5,
    },
    id: 'burn',
    label: 'BURN',
    tags: ['flame'],
    type: 'payload',
  },
  double: {
    accent: [255, 212, 92],
    cost: 1,
    description: 'Double the next payload.',
    effect: {},
    id: 'double',
    label: 'DOUBLE',
    modifier: {
      kind: 'double',
    },
    tags: [],
    type: 'modifier',
  },
  echo: {
    accent: [171, 153, 255],
    cost: 1,
    description: 'Repeat half the current result on the next payload.',
    effect: {},
    id: 'echo',
    label: 'ECHO',
    modifier: {
      kind: 'echo',
    },
    tags: [],
    type: 'modifier',
  },
  focus: {
    accent: [129, 200, 255],
    cost: 1,
    description: 'Draw 2 cards.',
    effect: {
      draw: 2,
    },
    id: 'focus',
    label: 'FOCUS',
    tags: [],
    type: 'utility',
  },
  quick: {
    accent: [115, 220, 255],
    cost: 1,
    description: 'Add tempo: draw 1, then sharpen the next payload.',
    effect: {
      draw: 1,
    },
    id: 'quick',
    label: 'QUICK',
    modifier: {
      kind: 'quick',
    },
    tags: [],
    type: 'modifier',
  },
  root: {
    accent: [165, 139, 99],
    cost: 1,
    description: 'Gain 5 block and heal 2.',
    effect: {
      block: 5,
      heal: 2,
    },
    id: 'root',
    label: 'ROOT',
    tags: ['growth'],
    type: 'payload',
  },
  shield: {
    accent: [112, 150, 255],
    cost: 1,
    description: 'Gain 8 block.',
    effect: {
      block: 8,
    },
    id: 'shield',
    label: 'SHIELD',
    tags: ['guard'],
    type: 'payload',
  },
  thorn: {
    accent: [255, 163, 102],
    cost: 1,
    description: 'Deal 7 damage.',
    effect: {
      damage: 7,
    },
    id: 'thorn',
    label: 'THORN',
    tags: ['thorn'],
    type: 'payload',
  },
  wide: {
    accent: [153, 215, 96],
    cost: 1,
    description: 'Broaden the next payload with extra side effects.',
    effect: {
      block: 2,
    },
    id: 'wide',
    label: 'WIDE',
    modifier: {
      kind: 'wide',
    },
    tags: [],
    type: 'modifier',
  },
  wilt: {
    accent: [141, 203, 118],
    cost: 1,
    description: 'Deal 4 damage and heal 2.',
    effect: {
      damage: 4,
      heal: 2,
    },
    id: 'wilt',
    label: 'WILT',
    tags: ['growth'],
    type: 'payload',
  },
}

export const STARTER_DECK = [
  'burn',
  'thorn',
  'shield',
  'bloom',
  'double',
  'quick',
  'wide',
  'echo',
  'burn',
  'shield',
  'focus',
  'barrier',
] as const

export const REWARD_POOLS = [
  ['root', 'double', 'barrier'],
  ['wilt', 'echo', 'focus'],
] as const
