import type { Card, CardDefinition, Sprite } from '../types'

export const CARD_DEFINITIONS = {
  bastion1: {
    accent: [96, 129, 218],
    cost: 2,
    description: 'Gain 12 block.',
    effect: {
      block: 12,
    },
    id: 'bastion1',
    label: 'BASTION',
    sprite: 'bastion',
    tags: ['guard'],
    type: 'payload',
  },

  bloom1: {
    accent: [129, 210, 141],
    cost: 1,
    description: 'Gain 5 block and heal 2.',
    effect: {
      block: 5,
      heal: 2,
    },
    id: 'bloom1',
    label: 'BLOOM',
    sprite: 'bloom',
    tags: ['growth'],
    type: 'payload',
  },

  burn1: {
    accent: [255, 118, 74],
    cost: 1,
    description: 'Deal 5 damage and apply 2 burn.',
    effect: {
      burn: 2,
      damage: 5,
    },
    id: 'burn1',
    label: 'BURN',
    sprite: 'burn',
    tags: ['flame'],
    type: 'payload',
  },

  charge1: {
    accent: [255, 238, 142],
    cost: 1,
    description: 'Gain 2 energy and draw 1.',
    effect: {
      draw: 1,
      energy: 2,
    },
    id: 'charge1',
    label: 'CHARGE',
    sprite: 'charge' as Sprite,
    tags: [],
    type: 'payload',
  },

  double1: {
    accent: [255, 212, 92],
    cost: 2,
    description: "Double the payload's effects.",
    effect: {},
    id: 'double1',
    label: 'DOUBLE',
    modifier: {
      kind: 'double',
    },
    sprite: 'double',
    tags: [],
    type: 'modifier',
  },

  echo1: {
    accent: [171, 153, 255],
    cost: 1,
    description: 'Payload repeats half its effects.',
    effect: {},
    id: 'echo1',
    label: 'ECHO',
    modifier: {
      kind: 'echo',
    },
    sprite: 'echo' as Sprite,
    tags: [],
    type: 'modifier',
  },

  embered1: {
    accent: [255, 143, 88],
    cost: 1,
    description: 'Payload applies 3 burn.',
    effect: {},
    id: 'embered1',
    label: 'EMBERED',
    modifier: {
      kind: 'embered',
    },
    sprite: 'embered' as Sprite,
    tags: [],
    type: 'modifier',
  },

  focus1: {
    accent: [129, 200, 255],
    cost: 1,
    description: 'Draw 2 cards.',
    effect: {
      draw: 2,
    },
    id: 'focus1',
    label: 'FOCUS',
    sprite: 'focus',
    tags: [],
    type: 'payload',
  },

  heavy1: {
    accent: [143, 125, 102],
    cost: 2,
    description: 'Payload gains heavy bonuses.',
    effect: {},
    id: 'heavy1',
    label: 'HEAVY',
    modifier: {
      kind: 'heavy',
    },
    sprite: 'heavy',
    tags: [],
    type: 'modifier',
  },

  leech1: {
    accent: [145, 209, 164],
    cost: 2,
    description: 'Damaging payload heals half its damage.',
    effect: {},
    id: 'leech1',
    label: 'LEECH',
    modifier: {
      kind: 'leech',
    },
    sprite: 'leech',
    tags: [],
    type: 'modifier',
  },

  pierce1: {
    accent: [198, 217, 255],
    cost: 2,
    description: 'Payload damage bypasses block.',
    effect: {},
    id: 'pierce1',
    label: 'PIERCE',
    modifier: {
      kind: 'pierce',
    },
    sprite: 'pierce',
    tags: [],
    type: 'modifier',
  },

  quick1: {
    accent: [115, 220, 255],
    cost: 1,
    description: 'Payload gains a small boost and draw 1.',
    effect: {
      draw: 1,
    },
    id: 'quick1',
    label: 'QUICK',
    modifier: {
      kind: 'quick',
    },
    sprite: 'quick' as Sprite,
    tags: [],
    type: 'modifier',
  },

  rage1: {
    accent: [255, 122, 122],
    cost: 0,
    description: 'Gain 1 energy. Lose 4 health.',
    effect: {
      energy: 1,
      selfDamage: 4,
      selfDamageIgnoresBlock: true,
    },
    id: 'rage1',
    label: 'RAGE',
    sprite: 'rage' as Sprite,
    tags: [],
    type: 'payload',
  },

  risky1: {
    accent: [255, 156, 142],
    cost: 1,
    description: 'Payload gains bonuses. You take 2 damage.',
    effect: {},
    id: 'risky1',
    label: 'RISKY',
    modifier: {
      kind: 'risky',
    },
    sprite: 'risky' as Sprite,
    tags: [],
    type: 'modifier',
  },

  safe1: {
    accent: [167, 221, 202],
    cost: 1,
    description: 'Payload gains 3 block.',
    effect: {},
    id: 'safe1',
    label: 'SAFE',
    modifier: {
      kind: 'safe',
    },
    sprite: 'safe' as Sprite,
    tags: [],
    type: 'modifier',
  },

  sear1: {
    accent: [255, 103, 64],
    cost: 1,
    description: 'Apply 5 burn.',
    effect: {
      burn: 5,
    },
    id: 'sear1',
    label: 'SEAR',
    sprite: 'sear' as Sprite,
    tags: ['flame'],
    type: 'payload',
  },

  shield1: {
    accent: [112, 150, 255],
    cost: 1,
    description: 'Gain 7 block.',
    effect: {
      block: 7,
    },
    id: 'shield1',
    label: 'SHIELD',
    sprite: 'shield' as Sprite,
    tags: ['guard'],
    type: 'payload',
  },

  surge1: {
    accent: [118, 205, 255],
    cost: 1,
    description: 'Deal 4 damage and draw 1.',
    effect: {
      damage: 4,
      draw: 1,
    },
    id: 'surge1',
    label: 'SURGE',
    sprite: 'surge',
    tags: ['flame'],
    type: 'payload',
  },

  thorn1: {
    accent: [255, 163, 102],
    cost: 1,
    description: 'Deal 7 damage.',
    effect: {
      damage: 7,
    },
    id: 'thorn1',
    label: 'THORN',
    sprite: 'thorn',
    tags: ['thorn'],
    type: 'payload',
  },

  ward1: {
    accent: [142, 194, 255],
    cost: 1,
    description: 'Gain 4 block and draw 1.',
    effect: {
      block: 4,
      draw: 1,
    },
    id: 'ward1',
    label: 'WARD',
    sprite: 'ward' as Sprite,
    tags: ['guard'],
    type: 'payload',
  },

  wide1: {
    accent: [153, 215, 96],
    cost: 1,
    description: 'Payload adds a small side effect.',
    effect: {
      block: 2,
    },
    id: 'wide1',
    label: 'WIDE',
    modifier: {
      kind: 'wide',
    },
    sprite: 'wide' as Sprite,
    tags: [],
    type: 'modifier',
  },

  wilt1: {
    accent: [141, 203, 118],
    cost: 1,
    description: 'Deal 4 damage and heal 1.',
    effect: {
      damage: 4,
      heal: 1,
    },
    id: 'wilt1',
    label: 'WILT',
    sprite: 'wilt',
    tags: ['growth'],
    type: 'payload',
  },
} as const satisfies Record<string, CardDefinition>

export const STARTER_DECK: Card[] = [
  'bloom1',
  'burn1',
  'burn1',
  'focus1',
  'quick1',
  'safe1',
  'shield1',
  'shield1',
  'surge1',
  'thorn1',
  'thorn1',
  'wide1',
] as const
