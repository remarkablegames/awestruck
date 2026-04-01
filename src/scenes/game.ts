import type { GameObj } from 'kaplay'

import {
  getCardDefinition,
  getChainPreview,
  getDeckCountLabel,
} from '../combat'
import { CARD, HAND, SCENE, SOUND, THEME } from '../constants'
import {
  addButton,
  addDungeonBackdrop,
  addEnemy,
  addHand,
  addPanelShadow,
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
      window.clearTimeout(hoverScrollDelayId)
      hoverScrollDelayId = null
    }

    if (hoverScrollIntervalId !== null) {
      window.clearInterval(hoverScrollIntervalId)
      hoverScrollIntervalId = null
    }
  }

  const renderBackground = () => {
    const actionAreaTop = height() * ACTION_AREA_TOP_RATIO

    addDungeonBackdrop({ actionAreaTop })
  }

  const renderHeader = (state: CombatState) => {
    track(
      add([
        text(`Floor ${String(state.floor)}, Turn ${String(state.turn)}`, {
          size: 26,
        }),
        color(247, 232, 179),
        pos(40, 28),
      ]),
    )

    track(
      add([
        text(
          `Player HP ${String(state.player.health)}/${String(state.player.maxHealth)}`,
          {
            size: 20,
          },
        ),
        color(227, 239, 255),
        pos(40, 66),
      ]),
    )

    track(
      add([
        text(
          `Block ${String(state.player.block)}, Energy ${String(state.player.energy)}/${String(state.player.maxEnergy)}`,
          {
            size: 20,
          },
        ),
        color(171, 198, 255),
        pos(40, 94),
      ]),
    )

    track(
      add([
        text(
          `Draw ${String(state.drawPile.length)}, Discard ${String(state.discardPile.length)}, Deck ${getDeckCountLabel(state)}`,
          {
            size: 20,
          },
        ),
        color(155, 166, 196),
        pos(40, 124),
      ]),
    )
  }

  const renderEnemyPanel = (state: CombatState) => {
    const panelX = width() - 300
    const panelY = 24
    const panelWidth = 250
    const panelHeight = 210
    const textWidth = panelWidth - 40

    addPanelShadow({
      height: panelHeight,
      width: panelWidth,
      x: panelX,
      y: panelY,
    })

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
          `HP ${String(state.enemy.health)}/${String(state.enemy.maxHealth)}`,
          {
            size: 20,
            width: textWidth,
          },
        ),
        color(251, 214, 198),
        pos(panelX + 20, panelY + 66),
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
        pos(panelX + 20, panelY + 94),
      ]),
    )

    const intent = state.enemy.intents[state.enemy.intentCursor]

    track(
      add([
        text(`Intent: ${intent.label}`, {
          size: 18,
          width: textWidth,
        }),
        color(174, 208, 255),
        pos(panelX + 20, panelY + 118),
      ]),
    )

    track(
      add([
        text(intent.description, {
          size: 18,
          width: textWidth,
        }),
        color(214, 224, 250),
        pos(panelX + 20, panelY + 142),
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

    addPanelShadow({
      height: panelHeight,
      width: width() - 80,
      x: panelX,
      y: panelY,
    })

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

        hoverScrollDelayId = window.setTimeout(() => {
          hoverScrollIntervalId = window.setInterval(() => {
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
    renderHeader(state)
    renderEnemyPanel(state)
    renderBuilderPanel(state)
    renderActionButtons(state)
    renderHand(state)
    renderHandScrollZones(state)
    renderFooter(state)
  }

  onKeyPress('escape', () => {
    go(SCENE.TITLE)
  })

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

    if (direction === 0) {
      return
    }

    scrollHand(direction > 0 ? 1 : -1, HAND.WHEEL_SCROLL_STEP)
  })

  const enemyDisplay = addEnemy(stateManager.getState().enemy)
  let previousPlayerHealth = stateManager.getState().player.health

  const unsubscribe = stateManager.subscribe(
    ({ actionResult, endStatus, scene, state }) => {
      const hitDamage =
        actionResult?.type === 'confirmBuilder' ? actionResult.enemyDamage : 0
      const playerDamageTaken = Math.max(
        0,
        previousPlayerHealth - state.player.health,
      )

      previousPlayerHealth = state.player.health

      if (playerDamageTaken > 0) {
        play(SOUND.PUNCH)
        shake(10)
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
          if (hitDamage > 0) {
            wait(0, () => {
              enemyDisplay.sync(state.enemy)
              renderUI(state)
              enemyDisplay.playHit(hitDamage)
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
            if (hitDamage > 0) {
              wait(0, () => {
                enemyDisplay.sync(state.enemy)
                renderUI(state)
                enemyDisplay.playHit(hitDamage)
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

  add([pos(0, 0)]).onDestroy(() => {
    unsubscribe()
    enemyDisplay.destroy()
    clearHoverScroll()
    clearUI()
  })

  renderBackground()
  const initialSnapshot = stateManager.getSnapshot()

  switch (initialSnapshot.scene) {
    case SCENE.REWARD:
      go(SCENE.REWARD)
      return
    case SCENE.END:
      if (initialSnapshot.endStatus) {
        go(SCENE.END, initialSnapshot.endStatus)
      }
      return
    case SCENE.GAME:
      renderUI(initialSnapshot.state)
      return
  }
})
