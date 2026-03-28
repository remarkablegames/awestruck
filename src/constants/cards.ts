import type { CardDefinition } from '../types'

export const CARD_DEFINITIONS: Record<string, CardDefinition> = {
  bastion: {
    accent: [96, 129, 218],
    cost: 2,
    description: 'Gain 12 block.',
    effect: {
      block: 12,
    },
    id: 'bastion',
    label: 'BASTION',
    tags: ['guard'],
    type: 'payload',
  },

  bloom: {
    accent: [129, 210, 141],
    cost: 1,
    description: 'Gain 5 block and heal 2.',
    effect: {
      block: 5,
      heal: 2,
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

  charge: {
    accent: [255, 238, 142],
    cost: 1,
    description: 'Gain 2 energy and draw 1.',
    effect: {
      draw: 1,
      energy: 2,
    },
    id: 'charge',
    label: 'CHARGE',
    tags: [],
    type: 'payload',
  },

  double: {
    accent: [255, 212, 92],
    cost: 2,
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

  embered: {
    accent: [255, 143, 88],
    cost: 1,
    description: 'The next payload also applies burn.',
    effect: {},
    id: 'embered',
    label: 'EMBERED',
    modifier: {
      kind: 'embered',
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
    type: 'payload',
  },

  heavy: {
    accent: [143, 125, 102],
    cost: 2,
    description: 'Make the next payload much heavier.',
    effect: {},
    id: 'heavy',
    label: 'HEAVY',
    modifier: {
      kind: 'heavy',
    },
    tags: [],
    type: 'modifier',
  },

  leech: {
    accent: [145, 209, 164],
    cost: 2,
    description: 'The next damaging payload also heals you.',
    effect: {},
    id: 'leech',
    label: 'LEECH',
    modifier: {
      kind: 'leech',
    },
    tags: [],
    type: 'modifier',
  },

  pierce: {
    accent: [198, 217, 255],
    cost: 2,
    description: 'The next damaging payload ignores block.',
    effect: {},
    id: 'pierce',
    label: 'PIERCE',
    modifier: {
      kind: 'pierce',
    },
    tags: [],
    type: 'modifier',
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

  rage: {
    accent: [255, 122, 122],
    cost: 0,
    description: 'Gain 1 energy. Lose 4 health.',
    effect: {
      energy: 1,
      selfDamage: 4,
      selfDamageIgnoresBlock: true,
    },
    id: 'rage',
    label: 'RAGE',
    tags: [],
    type: 'payload',
  },

  risky: {
    accent: [255, 156, 142],
    cost: 1,
    description: 'Push the next payload harder, but take 2 damage.',
    effect: {},
    id: 'risky',
    label: 'RISKY',
    modifier: {
      kind: 'risky',
    },
    tags: [],
    type: 'modifier',
  },

  safe: {
    accent: [167, 221, 202],
    cost: 1,
    description: 'The next payload also grants a little block.',
    effect: {},
    id: 'safe',
    label: 'SAFE',
    modifier: {
      kind: 'safe',
    },
    tags: [],
    type: 'modifier',
  },

  sear: {
    accent: [255, 103, 64],
    cost: 1,
    description: 'Apply 5 burn.',
    effect: {
      burn: 5,
    },
    id: 'sear',
    label: 'SEAR',
    tags: ['flame'],
    type: 'payload',
  },

  shield: {
    accent: [112, 150, 255],
    cost: 1,
    description: 'Gain 7 block.',
    effect: {
      block: 7,
    },
    id: 'shield',
    label: 'SHIELD',
    tags: ['guard'],
    type: 'payload',
  },

  surge: {
    accent: [118, 205, 255],
    cost: 1,
    description: 'Deal 4 damage and draw 1.',
    effect: {
      damage: 4,
      draw: 1,
    },
    id: 'surge',
    label: 'SURGE',
    tags: ['flame'],
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

  ward: {
    accent: [142, 194, 255],
    cost: 1,
    description: 'Gain 4 block and draw 1.',
    effect: {
      block: 4,
      draw: 1,
    },
    id: 'ward',
    label: 'WARD',
    tags: ['guard'],
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
    description: 'Deal 4 damage and heal 1.',
    effect: {
      damage: 4,
      heal: 1,
    },
    id: 'wilt',
    label: 'WILT',
    tags: ['growth'],
    type: 'payload',
  },
}

export const STARTER_DECK = [
  'bloom',
  'burn',
  'burn',
  'focus',
  'quick',
  'safe',
  'shield',
  'shield',
  'surge',
  'thorn',
  'thorn',
  'wide',
] as const

export const REWARD_POOLS = [
  ['sear', 'pierce', 'ward', 'wilt'],
  ['bastion', 'heavy', 'embered', 'leech', 'double'],
  ['rage', 'risky', 'echo', 'charge'],
] as const
