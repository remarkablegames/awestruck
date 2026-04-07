import type { ColorComp, GameObj, PosComp } from 'kaplay'

import { LAYER, SOUND } from '../constants'
import type { EnemyIntent, EnemyState } from '../types'
import { addFlash, addHealthBar, addPill, addShield } from '.'

const BOX_WIDTH = 350
const BOX_HEIGHT = 276
const BOX_Y = 32
const FRAME_PADDING = 10
const HIT_SHAKE_DISTANCE = 16
const HIT_DURATION = 0.1
const DAMAGE_DURATION = 0.5
const HEALTH_BAR_WIDTH = BOX_WIDTH + FRAME_PADDING * 2
const HEALTH_BAR_HEIGHT = 30
const HEALTH_BAR_Y = BOX_HEIGHT + 24
const INTENT_PILL_WIDTH = 220
const INTENT_PILL_HEIGHT = 26
const INTENT_PILL_Y = HEALTH_BAR_Y - 18
const SHIELD_X = BOX_WIDTH + FRAME_PADDING
const SHIELD_Y = 6

export function addEnemy(enemy: EnemyState) {
  const root = add([pos(width() / 2 - BOX_WIDTH / 2, BOX_Y), z(LAYER.ENEMY)])

  root.add([
    rect(BOX_WIDTH + FRAME_PADDING * 2, BOX_HEIGHT + FRAME_PADDING * 2, {
      radius: 24,
    }),
    color(58, 42, 61),
    outline(2, rgb(221, 178, 160)),
    pos(-FRAME_PADDING),
  ])

  const flash = addFlash({
    color: [255, 214, 214],
    height: BOX_HEIGHT + FRAME_PADDING * 2,
    opacity: 0.24,
    parent: root,
    width: BOX_WIDTH + FRAME_PADDING * 2,
    x: -FRAME_PADDING,
    y: -FRAME_PADDING,
  })

  const healthBar = addHealthBar({
    current: enemy.health,
    height: HEALTH_BAR_HEIGHT,
    max: enemy.maxHealth,
    parent: root,
    width: HEALTH_BAR_WIDTH,
    x: -FRAME_PADDING,
    y: HEALTH_BAR_Y,
  })

  const intentPill = addPill({
    label: getIntentLabel(enemy),
    size: 16,
    width: INTENT_PILL_WIDTH,
    height: INTENT_PILL_HEIGHT,
    x: BOX_WIDTH / 2,
    y: INTENT_PILL_Y,
    parent: root,
  })

  const shield = addShield({
    parent: root,
    value: enemy.block,
    x: SHIELD_X,
    y: SHIELD_Y,
  })

  const healthText = root.add([
    text(getHealthTextLabel(enemy.health, enemy.maxHealth), {
      align: 'center',
      size: 18,
      width: HEALTH_BAR_WIDTH,
    }),
    color(251, 214, 198),
    pos(
      -FRAME_PADDING + HEALTH_BAR_WIDTH / 2,
      HEALTH_BAR_Y + 1 + HEALTH_BAR_HEIGHT / 2,
    ),
    anchor('center'),
  ])

  let spriteObject: GameObj<ColorComp | PosComp> | null = null
  let spriteName = ''

  const renderSprite = (nextSpriteName: string) => {
    spriteObject?.destroy()

    getSprite(nextSpriteName)?.then((data) => {
      const spriteWidth = data.width
      const spriteHeight = data.height
      const scale = Math.min(BOX_WIDTH / spriteWidth, BOX_HEIGHT / spriteHeight)
      const displayWidth = spriteWidth * scale
      const displayHeight = spriteHeight * scale

      spriteObject = root.add([
        sprite(nextSpriteName, {
          height: displayHeight,
          width: displayWidth,
        }),
        color(255, 255, 255),
        pos((BOX_WIDTH - displayWidth) / 2, (BOX_HEIGHT - displayHeight) / 2),
      ])

      spriteName = nextSpriteName
    })
  }

  const resetHitVisuals = () => {
    root.pos = vec2(width() / 2 - BOX_WIDTH / 2, BOX_Y)

    if (spriteObject) {
      spriteObject.color = rgb(255, 255, 255)
    }
  }

  renderSprite(enemy.sprite)

  return {
    destroy() {
      root.destroy()
    },

    playHit(damage: number) {
      resetHitVisuals()
      play(SOUND.HIT)
      flash.play()

      if (spriteObject) {
        spriteObject.color = rgb(255, 208, 208)
      }

      const basePos = vec2(width() / 2 - BOX_WIDTH / 2, BOX_Y)
      const offsetX = Math.min(HIT_SHAKE_DISTANCE + damage, 28)

      tween(
        0,
        1,
        HIT_DURATION,
        (value) => {
          root.pos = vec2(basePos.x - offsetX * value, basePos.y)
        },
        easings.easeOutQuad,
      ).onEnd(() => {
        tween(
          0,
          1,
          HIT_DURATION * 1.5,
          (value) => {
            root.pos = vec2(basePos.x + offsetX * value, basePos.y)

            if (spriteObject) {
              const tint = Math.round(208 + (255 - 208) * value)
              spriteObject.color = rgb(255, tint, tint)
            }
          },
          easings.easeInOutQuad,
        ).onEnd(() => {
          tween(
            root.pos,
            basePos,
            HIT_DURATION,
            (value) => {
              root.pos = value
            },
            easings.easeOutQuad,
          ).onEnd(() => {
            resetHitVisuals()
          })
        })
      })

      const damageLabel = add([
        text(`-${String(damage)}`, {
          size: 30,
        }),
        color(255, 216, 216),
        opacity(1),
        lifespan(DAMAGE_DURATION, { fade: 0.1 }),
        pos(width() / 2, BOX_Y + 90),
        anchor('center'),
        z(LAYER.ENEMY),
      ])

      tween(
        damageLabel.pos,
        damageLabel.pos.add(0, -42),
        0.28,
        (value) => {
          damageLabel.pos = value
        },
        easings.easeOutQuad,
      )
    },

    sync(nextEnemy: EnemyState) {
      healthBar.sync(nextEnemy.health, nextEnemy.maxHealth)
      intentPill.sync(getIntentLabel(nextEnemy))
      shield.root.hidden = nextEnemy.block <= 0
      shield.valueText.text = String(nextEnemy.block)

      healthText.text = getHealthTextLabel(
        nextEnemy.health,
        nextEnemy.maxHealth,
      )

      if (nextEnemy.sprite !== spriteName) {
        renderSprite(nextEnemy.sprite)
      }
    },
  }
}

function getHealthTextLabel(health: number, maxHealth: number): string {
  return [health, maxHealth].join('/')
}

function getIntentLabel(enemy: EnemyState): string {
  if (enemy.stunned) {
    return 'Stunned'
  }

  return getIntentText(enemy.intents[enemy.intentCursor])
}

function getIntentText(intent: EnemyIntent): string {
  const labels: string[] = []

  if (intent.attack) {
    labels.push(`Attack ${String(intent.attack)}`)
  }

  if (intent.block) {
    labels.push(`Block ${String(intent.block)}`)
  }

  return labels.length ? labels.join(', ') : '...'
}
