import type { Card, CardDefinition, Sprite } from '../types'

export const CARD_DEFINITIONS = {
  bastion1: {
    accent: [96, 129, 218],
    cost: 2,
    description: 'Gain 10 block.',
    effect: {
      block: 10,
    },
    id: 'bastion1',
    label: 'BASTION',
    sprite: 'bastion',
    tags: ['guard'],
    type: 'payload',
    upgrade: 'bastion2',
  },

  bastion2: {
    accent: [96, 129, 218],
    cost: 2,
    description: 'Gain 14 block.',
    effect: {
      block: 14,
    },
    id: 'bastion2',
    label: 'BASTION+',
    sprite: 'bastion',
    tags: ['guard'],
    type: 'payload',
  },

  bloom1: {
    accent: [129, 210, 141],
    cost: 1,
    description: 'Gain 3 block and heal 2.',
    effect: {
      block: 3,
      heal: 2,
    },
    id: 'bloom1',
    label: 'BLOOM',
    sprite: 'bloom',
    tags: ['growth'],
    type: 'payload',
    upgrade: 'bloom2',
  },

  bloom2: {
    accent: [129, 210, 141],
    cost: 1,
    description: 'Gain 7 block and heal 3.',
    effect: {
      block: 7,
      heal: 3,
    },
    id: 'bloom2',
    label: 'BLOOM+',
    sprite: 'bloom',
    tags: ['growth'],
    type: 'payload',
  },

  burn1: {
    accent: [255, 118, 74],
    cost: 1,
    description: 'Deal 3 damage and apply 2 burn.',
    effect: {
      burn: 2,
      damage: 3,
    },
    id: 'burn1',
    label: 'BURN',
    sprite: 'burn',
    tags: ['flame'],
    type: 'payload',
    upgrade: 'burn2',
  },

  burn2: {
    accent: [255, 118, 74],
    cost: 1,
    description: 'Deal 6 damage and apply 3 burn.',
    effect: {
      burn: 3,
      damage: 6,
    },
    id: 'burn2',
    label: 'BURN+',
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
    upgrade: 'charge2',
  },

  charge2: {
    accent: [255, 238, 142],
    cost: 0,
    description: 'Gain 2 energy and draw 1.',
    effect: {
      draw: 1,
      energy: 2,
    },
    id: 'charge2',
    label: 'CHARGE+',
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
    upgrade: 'double2',
  },

  double2: {
    accent: [255, 212, 92],
    cost: 1,
    description: "Double the payload's effects.",
    effect: {},
    id: 'double2',
    label: 'DOUBLE+',
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
    upgrade: 'echo2',
  },

  echo2: {
    accent: [171, 153, 255],
    cost: 0,
    description: 'Payload repeats half its effects.',
    effect: {},
    id: 'echo2',
    label: 'ECHO+',
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
    upgrade: 'embered2',
  },

  embered2: {
    accent: [255, 143, 88],
    cost: 0,
    description: 'Payload applies 3 burn.',
    effect: {},
    id: 'embered2',
    label: 'EMBERED+',
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
    upgrade: 'focus2',
  },

  focus2: {
    accent: [129, 200, 255],
    cost: 1,
    description: 'Draw 3 cards.',
    effect: {
      draw: 3,
    },
    id: 'focus2',
    label: 'FOCUS+',
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
    upgrade: 'heavy2',
  },

  heavy2: {
    accent: [143, 125, 102],
    cost: 1,
    description: 'Payload gains heavy bonuses.',
    effect: {},
    id: 'heavy2',
    label: 'HEAVY+',
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
    upgrade: 'leech2',
  },

  leech2: {
    accent: [145, 209, 164],
    cost: 1,
    description: 'Damaging payload heals half its damage.',
    effect: {},
    id: 'leech2',
    label: 'LEECH+',
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
    upgrade: 'pierce2',
  },

  pierce2: {
    accent: [198, 217, 255],
    cost: 1,
    description: 'Payload damage bypasses block.',
    effect: {},
    id: 'pierce2',
    label: 'PIERCE+',
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
    upgrade: 'quick2',
  },

  quick2: {
    accent: [115, 220, 255],
    cost: 0,
    description: 'Payload gains a small boost and draw 1.',
    effect: {
      draw: 1,
    },
    id: 'quick2',
    label: 'QUICK+',
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
    upgrade: 'rage2',
  },

  rage2: {
    accent: [255, 122, 122],
    cost: 0,
    description: 'Gain 2 energy. Lose 3 health.',
    effect: {
      energy: 2,
      selfDamage: 3,
      selfDamageIgnoresBlock: true,
    },
    id: 'rage2',
    label: 'RAGE+',
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
    upgrade: 'risky2',
  },

  risky2: {
    accent: [255, 156, 142],
    cost: 0,
    description: 'Payload gains bonuses. You take 2 damage.',
    effect: {},
    id: 'risky2',
    label: 'RISKY+',
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
    upgrade: 'safe2',
  },

  safe2: {
    accent: [167, 221, 202],
    cost: 0,
    description: 'Payload gains 3 block.',
    effect: {},
    id: 'safe2',
    label: 'SAFE+',
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
    upgrade: 'sear2',
  },

  sear2: {
    accent: [255, 103, 64],
    cost: 1,
    description: 'Apply 7 burn.',
    effect: {
      burn: 7,
    },
    id: 'sear2',
    label: 'SEAR+',
    sprite: 'sear' as Sprite,
    tags: ['flame'],
    type: 'payload',
  },

  shield1: {
    accent: [112, 150, 255],
    cost: 1,
    description: 'Gain 5 block.',
    effect: {
      block: 5,
    },
    id: 'shield1',
    label: 'SHIELD',
    sprite: 'shield' as Sprite,
    tags: ['guard'],
    type: 'payload',
    upgrade: 'shield2',
  },

  shield2: {
    accent: [112, 150, 255],
    cost: 1,
    description: 'Gain 8 block.',
    effect: {
      block: 8,
    },
    id: 'shield2',
    label: 'SHIELD+',
    sprite: 'shield' as Sprite,
    tags: ['guard'],
    type: 'payload',
  },

  surge1: {
    accent: [118, 205, 255],
    cost: 1,
    description: 'Deal 2 damage and draw 1.',
    effect: {
      damage: 2,
      draw: 1,
    },
    id: 'surge1',
    label: 'SURGE',
    sprite: 'surge',
    tags: ['flame'],
    type: 'payload',
    upgrade: 'surge2',
  },

  surge2: {
    accent: [118, 205, 255],
    cost: 1,
    description: 'Deal 5 damage and draw 1.',
    effect: {
      damage: 5,
      draw: 1,
    },
    id: 'surge2',
    label: 'SURGE+',
    sprite: 'surge',
    tags: ['flame'],
    type: 'payload',
  },

  thorn1: {
    accent: [255, 163, 102],
    cost: 1,
    description: 'Deal 5 damage.',
    effect: {
      damage: 5,
    },
    id: 'thorn1',
    label: 'THORN',
    sprite: 'thorn',
    tags: ['thorn'],
    type: 'payload',
    upgrade: 'thorn2',
  },

  thorn2: {
    accent: [255, 163, 102],
    cost: 1,
    description: 'Deal 8 damage.',
    effect: {
      damage: 8,
    },
    id: 'thorn2',
    label: 'THORN+',
    sprite: 'thorn',
    tags: ['thorn'],
    type: 'payload',
  },

  ward1: {
    accent: [142, 194, 255],
    cost: 1,
    description: 'Gain 3 block and draw 1.',
    effect: {
      block: 3,
      draw: 1,
    },
    id: 'ward1',
    label: 'WARD',
    sprite: 'ward' as Sprite,
    tags: ['guard'],
    type: 'payload',
    upgrade: 'ward2',
  },

  ward2: {
    accent: [142, 194, 255],
    cost: 1,
    description: 'Gain 6 block and draw 1.',
    effect: {
      block: 6,
      draw: 1,
    },
    id: 'ward2',
    label: 'WARD+',
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
    upgrade: 'wide2',
  },

  wide2: {
    accent: [153, 215, 96],
    cost: 0,
    description: 'Payload adds a small side effect.',
    effect: {
      block: 2,
    },
    id: 'wide2',
    label: 'WIDE+',
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
    description: 'Deal 3 damage and heal 1.',
    effect: {
      damage: 3,
      heal: 1,
    },
    id: 'wilt1',
    label: 'WILT',
    sprite: 'wilt',
    tags: ['growth'],
    type: 'payload',
  },

  wilt2: {
    accent: [141, 203, 118],
    cost: 1,
    description: 'Deal 6 damage and heal 2.',
    effect: {
      damage: 6,
      heal: 2,
    },
    id: 'wilt2',
    label: 'WILT+',
    sprite: 'wilt',
    tags: ['growth'],
    type: 'payload',
    upgrade: 'wilt2',
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
