import { CARDS } from '../constants'
import type { Color, ModifierDefinition, Sprite } from '.'

export type Card = keyof typeof CARDS.CARD_DEFINITIONS

export interface CardEffect {
  block?: number
  burn?: number
  damage?: number
  draw?: number
  energy?: number
  heal?: number
  ignoreBlock?: boolean
  stun?: number
  selfDamageIgnoresBlock?: boolean
  selfDamage?: number
}

export type CardTag = 'flame' | 'growth' | 'guard' | 'thorn'

export interface CardDefinition {
  accent: Color
  cost: number
  description: string
  effect: CardEffect
  id: string
  label: string
  modifier?: ModifierDefinition
  sprite: Sprite
  tags: CardTag[]
  type: 'modifier' | 'payload'
  upgrade?: string
}

export interface CardInstance {
  cardId: Card
  instanceId: string
}
