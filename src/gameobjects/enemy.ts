import type { ColorComp, GameObj, PosComp } from 'kaplay'

import { LAYER, SOUND } from '../constants'
import type { EnemyState } from '../types'
import { addHealthBar } from '.'

const BOX_WIDTH = 300
const BOX_HEIGHT = 240
const BOX_Y = 32
const FRAME_PADDING = 10
const HIT_SHAKE_DISTANCE = 16
const HIT_DURATION = 0.1
const DAMAGE_DURATION = 0.5
const HEALTH_BAR_WIDTH = BOX_WIDTH + FRAME_PADDING * 2
const HEALTH_BAR_HEIGHT = 18
const HEALTH_BAR_Y = BOX_HEIGHT + 24

export function addEnemy(enemy: EnemyState) {
  const root = add([pos(width() / 2 - BOX_WIDTH / 2, BOX_Y), z(LAYER.ENEMY)])

  root.add([
    rect(BOX_WIDTH + FRAME_PADDING * 2, BOX_HEIGHT + FRAME_PADDING * 2, {
      radius: 24,
    }),
    color(58, 42, 61),
    outline(2, rgb(221, 178, 160)),
    pos(-FRAME_PADDING, -FRAME_PADDING),
  ])

  const flash = root.add([
    rect(BOX_WIDTH, BOX_HEIGHT, { radius: 18 }),
    color(255, 214, 214),
    opacity(0),
    pos(0, 0),
  ])

  const healthBar = addHealthBar({
    current: enemy.health,
    height: HEALTH_BAR_HEIGHT,
    max: enemy.maxHealth,
    parent: root,
    width: HEALTH_BAR_WIDTH,
    x: -FRAME_PADDING,
    y: HEALTH_BAR_Y,
  })

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
    flash.opacity = 0

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

      if (nextEnemy.sprite !== spriteName) {
        renderSprite(nextEnemy.sprite)
      }
    },
  }
}
