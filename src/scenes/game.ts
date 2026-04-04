import type { GameObj } from 'kaplay'

import { getCardDefinition, getChainPreview } from '../combat'
import { CARD, COLOR, HAND, POSITION, SCENE, SOUND, THEME } from '../constants'
import {
  addBackdrop,
  addButton,
  addEnemy,
  addFlash,
  addHand,
  addStatus,
} from '../gameobjects'
import { getStateManager } from '../state'
import type { CombatState } from '../types'

const ACTION_AREA_TOP_RATIO = 0.42
const ACTION_BUTTON_OFFSET_Y = 60
const BUILDER_PANEL_OFFSET_Y = 10
const END_TURN_BUTTON_OFFSET_Y = -42
const DEFEAT_TRANSITION_DELAY = 1

scene(SCENE.GAME, () => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))

  const stateManager = getStateManager()

  let hoverScrollDelayId: number | null = null
  let hoverScrollIntervalId: number | null = null
  let handScrollOffset = 0

  const uiObjects: GameObj[] = []

  const track = <T extends GameObj>(object: T): T => {
    uiObjects.push(object)
    return object
  }

  const trackAll = <T extends GameObj>(objects: T[]): T[] => {
    objects.forEach((object) => {
      uiObjects.push(object)
    })

    return objects
  }

  const clearUI = () => {
    while (uiObjects.length) {
      uiObjects.pop()?.destroy()
    }
  }

  const clearHoverScroll = () => {
    if (hoverScrollDelayId !== null) {
      clearTimeout(hoverScrollDelayId)
      hoverScrollDelayId = null
    }

    if (hoverScrollIntervalId !== null) {
      clearInterval(hoverScrollIntervalId)
      hoverScrollIntervalId = null
    }
  }

  const flashDamage = addFlash({ color: COLOR.FLASH_DAMAGE })
  const flashHeal = addFlash({ color: COLOR.FLASH_HEAL })

  const renderEnemyPanel = (state: CombatState) => {
    const panelX = width() - 300
    const panelY = 24
    const panelWidth = 250
    const panelHeight = 210
    const textWidth = panelWidth - 40

    track(
      add([
        rect(panelWidth, panelHeight, { radius: 22 }),
        color(38, 29, 44),
        outline(4, rgb(195, 141, 138)),
        pos(panelX, panelY),
      ]),
    )

    track(
      add([
        text(state.enemy.label, {
          size: 28,
          width: textWidth,
        }),
        color(255, 226, 216),
        pos(panelX + 20, panelY + 22),
      ]),
    )

    track(
      add([
        text(
          `Block ${String(state.enemy.block)}, Burn ${String(state.enemy.burn)}`,
          {
            size: 18,
            width: textWidth,
          },
        ),
        color(255, 183, 120),
        pos(panelX + 20, panelY + 66),
      ]),
    )

    const intent = state.enemy.intents[state.enemy.intentCursor]

    track(
      add([
        text(intent.description, {
          size: 18,
          width: textWidth,
        }),
        color(214, 224, 250),
        pos(panelX + 20, panelY + 96),
      ]),
    )
  }

  const renderBuilderPanel = (state: CombatState) => {
    const actionAreaTop = height() * ACTION_AREA_TOP_RATIO
    const panelX = 40
    const panelY = actionAreaTop + BUILDER_PANEL_OFFSET_Y
    const panelHeight = 136
    const preview = getChainPreview(state.builder)
    const previewWidth = width() - 660
    const builderLabel = state.builder
      .map((card) => getCardDefinition(card.cardId).label)
      .join(' + ')
    const previewText = preview.previewText

    track(
      add([
        rect(width() - 80, panelHeight, { radius: 20 }),
        color(23, 31, 48),
        outline(4, rgb(88, 112, 162)),
        pos(panelX, panelY),
      ]),
    )

    track(
      add([
        text('Chain Builder', {
          size: 24,
        }),
        color(235, 241, 255),
        pos(panelX + 24, panelY + 18),
      ]),
    )

    track(
      add([
        text(builderLabel || 'No words committed', {
          size: 22,
          width: previewWidth,
        }),
        color(248, 229, 170),
        pos(panelX + 24, panelY + 56),
      ]),
    )

    track(
      add([
        text(previewText, {
          size: 20,
          width: previewWidth,
        }),
        color(181, 198, 236),
        pos(panelX + 24, panelY + 86),
      ]),
    )
  }

  const renderActionButtons = (state: CombatState) => {
    const actionAreaTop = height() * ACTION_AREA_TOP_RATIO
    const preview = getChainPreview(state.builder)

    const executeButton = addButton({
      disabled: state.status !== 'playerTurn' || preview.status !== 'ready',
      fillColor: [111, 168, 101],
      height: 54,
      label: 'Execute',
      onClick: () => {
        stateManager.confirmBuilder()
      },
      width: 150,
      x: width() - 305,
      y: actionAreaTop + ACTION_BUTTON_OFFSET_Y,
    })
    track(executeButton.button)
    track(executeButton.label)

    const cancelButton = addButton({
      disabled: state.status !== 'playerTurn' || !state.builder.length,
      fillColor: [176, 119, 93],
      height: 54,
      label: 'Cancel',
      onClick: () => {
        play(SOUND.BACK)
        stateManager.cancelBuilder()
      },
      width: 150,
      x: width() - 140,
      y: actionAreaTop + ACTION_BUTTON_OFFSET_Y,
    })
    track(cancelButton.button)
    track(cancelButton.label)

    const endTurnButton = addButton({
      disabled: state.status !== 'playerTurn',
      fillColor: [92, 130, 208],
      height: 52,
      label: 'End Turn',
      onClick: () => {
        play(SOUND.DROP)
        stateManager.endTurn()
      },
      width: 150,
      x: width() - 140,
      y: actionAreaTop + END_TURN_BUTTON_OFFSET_Y,
    })
    track(endTurnButton.button)
    track(endTurnButton.label)
  }

  const renderHand = (state: CombatState) => {
    const handObjects = addHand({
      onCardClick: (selectedCard) => {
        stateManager.commitChainCard(selectedCard.instanceId)
      },
      scrollOffset: handScrollOffset,
      state,
    })

    handScrollOffset = Math.min(handScrollOffset, handObjects.maxScrollOffset)
    trackAll(handObjects.objects)
  }

  const renderHandScrollZones = (state: CombatState) => {
    if (state.hand.length <= HAND.FAN_MAX_CARDS) {
      clearHoverScroll()
      return
    }

    const zoneHeight = CARD.HEIGHT + 24
    const zoneY = height() - CARD.HEIGHT / 2 - HAND.BOTTOM_MARGIN + 10

    const createZone = (direction: -1 | 1, x: number) => {
      const zone = track(
        add([
          rect(HAND.SCROLL_GUTTER_WIDTH, zoneHeight, { radius: 14 }),
          area(),
          color(92, 130, 208),
          opacity(0),
          pos(x, zoneY),
          anchor('center'),
        ]),
      )

      zone.onHover(() => {
        setCursor(direction < 0 ? 'w-resize' : 'e-resize')
        zone.opacity = 0.12
        clearHoverScroll()
        scrollHand(direction, HAND.HOVER_SCROLL_STEP)

        hoverScrollDelayId = setTimeout(() => {
          hoverScrollIntervalId = setInterval(() => {
            scrollHand(direction, HAND.HOVER_SCROLL_STEP)
          }, HAND.SCROLL_HOVER_INTERVAL_MS)
        }, HAND.SCROLL_HOVER_DELAY_MS)
      })

      zone.onHoverEnd(() => {
        setCursor('default')
        zone.opacity = 0
        clearHoverScroll()
      })

      zone.onDestroy(() => {
        setCursor('default')
        clearHoverScroll()
      })
    }

    createZone(-1, HAND.SCROLL_GUTTER_WIDTH / 2)
    createZone(1, width() - HAND.SCROLL_GUTTER_WIDTH / 2)
  }

  const renderFooter = (state: CombatState) => {
    track(
      add([
        text(state.message, {
          size: 20,
          width: width() - 80,
        }),
        color(218, 226, 246),
        pos(40, height() - 42),
      ]),
    )
  }

  const renderUI = (state: CombatState) => {
    clearUI()
    track(
      addStatus({
        state,
        ...POSITION.STATUS,
      }).root,
    )
    renderEnemyPanel(state)
    renderBuilderPanel(state)
    renderActionButtons(state)
    renderHand(state)
    renderHandScrollZones(state)
    renderFooter(state)
  }

  const scrollHand = (direction: -1 | 1, step: number) => {
    const state = stateManager.getState()

    if (state.hand.length <= HAND.FAN_MAX_CARDS) {
      return
    }

    handScrollOffset += direction * step
    handScrollOffset = Math.max(0, handScrollOffset)
    renderUI(state)
  }

  onScroll((delta) => {
    const state = stateManager.getState()

    if (state.hand.length <= HAND.FAN_MAX_CARDS) {
      return
    }

    const direction = delta.y === 0 ? delta.x : delta.y

    if (!direction) {
      return
    }

    scrollHand(direction > 0 ? 1 : -1, HAND.WHEEL_SCROLL_STEP)
  })

  const enemyDisplay = addEnemy(stateManager.getState().enemy)
  let previousPlayerHealth = stateManager.getState().player.health

  const unsubscribe = stateManager.subscribe(
    ({ actionResult, endStatus, scene, state }) => {
      const isConfirmBuilder = actionResult?.type === 'confirmBuilder'
      const isEndTurn = actionResult?.type === 'endTurn'

      const enemyDamage = isConfirmBuilder ? actionResult.enemyDamage : 0

      const playerBlockGained = isConfirmBuilder
        ? actionResult.playerBlockGained
        : 0

      const playerBlockedDamage = isEndTurn
        ? actionResult.playerBlockedDamage
        : 0

      const playerHealGained = isConfirmBuilder
        ? actionResult.playerHealGained
        : 0

      const playerDamageTaken = Math.max(
        0,
        previousPlayerHealth - state.player.health,
      )

      previousPlayerHealth = state.player.health

      if (playerDamageTaken > 0) {
        play(SOUND.PUNCH)
        flashDamage.play()
        shake(10)
      }

      if (playerBlockedDamage > 0) {
        play(SOUND.BLOCK, { detune: -100 })
      }

      if (playerBlockGained > 0) {
        play(SOUND.BLOCK)
      }

      if (playerHealGained > 0) {
        play(SOUND.HEAL)
        flashHeal.play()
      }

      switch (scene) {
        case SCENE.GAME:
          wait(0, () => {
            enemyDisplay.sync(state.enemy)

            if (actionResult?.type === 'confirmBuilder') {
              if (actionResult.enemyDamage > 0) {
                enemyDisplay.playHit(actionResult.enemyDamage)
              } else {
                play(SOUND.DROP)
              }
            }

            renderUI(state)
          })
          return

        case SCENE.REWARD:
          if (enemyDamage > 0) {
            wait(0, () => {
              enemyDisplay.sync(state.enemy)
              renderUI(state)
              enemyDisplay.playHit(enemyDamage)
            })

            wait(DEFEAT_TRANSITION_DELAY, () => {
              go(SCENE.REWARD)
            })
            return
          }

          wait(0, () => {
            go(SCENE.REWARD)
          })
          return

        case SCENE.END:
          if (endStatus) {
            if (enemyDamage > 0 || playerDamageTaken > 0) {
              wait(0, () => {
                enemyDisplay.sync(state.enemy)
                renderUI(state)

                if (enemyDamage > 0) {
                  enemyDisplay.playHit(enemyDamage)
                }
              })

              wait(DEFEAT_TRANSITION_DELAY, () => {
                go(SCENE.END, endStatus)
              })
              return
            }

            wait(0, () => {
              go(SCENE.END, endStatus)
            })
          }
          return
      }
    },
  )

  add([]).onDestroy(() => {
    unsubscribe()
    enemyDisplay.destroy()
    clearHoverScroll()
    clearUI()
  })

  addBackdrop({ actionAreaTop: height() * ACTION_AREA_TOP_RATIO })

  const snapshot = stateManager.getSnapshot()

  switch (snapshot.scene) {
    case SCENE.REWARD:
      go(SCENE.REWARD)
      return
    case SCENE.END:
      if (snapshot.endStatus) {
        go(SCENE.END, snapshot.endStatus)
      }
      return
    case SCENE.GAME:
      renderUI(snapshot.state)
      return
  }
})
