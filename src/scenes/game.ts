import {
  getCardCommitDisabledReason,
  getCardDefinition,
  getChainPreview,
  getDeckCountLabel,
} from '../combat'
import { CARD, SCENE, SOUND, THEME } from '../constants'
import { addButton, addCard } from '../gameobjects'
import { stateManager } from '../state'
import type { CardInstance, CombatState } from '../types'

const ACTION_AREA_TOP_RATIO = 0.42
const ACTION_BUTTON_OFFSET_Y = 60
const BUILDER_PANEL_OFFSET_Y = 10
const END_TURN_BUTTON_OFFSET_Y = -42
const toLabel = (value: number) => String(value)

interface Destroyable {
  destroy(): void
}

scene(SCENE.GAME, () => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))

  const uiObjects: Destroyable[] = []

  const track = <T extends Destroyable>(object: T): T => {
    uiObjects.push(object)
    return object
  }

  const trackAll = <T extends Destroyable>(objects: T[]): T[] => {
    objects.forEach((object) => {
      uiObjects.push(object)
    })

    return objects
  }

  const clearUi = () => {
    while (uiObjects.length) {
      uiObjects.pop()?.destroy()
    }
  }

  const renderBackground = () => {
    const actionAreaTop = height() * ACTION_AREA_TOP_RATIO

    add([
      rect(width(), height()),
      color(...THEME.GAME_BACKGROUND_COLOR),
      fixed(),
      pos(0, 0),
    ])

    add([
      rect(width(), actionAreaTop),
      color(...THEME.GAME_BACKGROUND_COLOR),
      fixed(),
      pos(0, 0),
      opacity(0.9),
    ])

    add([
      rect(width(), height() - actionAreaTop),
      color(...THEME.GAME_LOWER_BACKGROUND_COLOR),
      fixed(),
      pos(0, actionAreaTop),
      opacity(0.95),
    ])
  }

  const renderHeader = (state: CombatState) => {
    track(
      add([
        text(`Floor ${toLabel(state.floor)}, Turn ${toLabel(state.turn)}`, {
          size: 26,
        }),
        color(247, 232, 179),
        fixed(),
        pos(40, 28),
      ]),
    )

    track(
      add([
        text(
          `Player HP ${toLabel(state.player.health)}/${toLabel(state.player.maxHealth)}`,
          {
            size: 20,
          },
        ),
        color(227, 239, 255),
        fixed(),
        pos(40, 66),
      ]),
    )

    track(
      add([
        text(
          `Block ${toLabel(state.player.block)}, Energy ${toLabel(state.player.energy)}/${toLabel(state.player.maxEnergy)}`,
          {
            size: 20,
          },
        ),
        color(171, 198, 255),
        fixed(),
        pos(40, 94),
      ]),
    )

    track(
      add([
        text(
          `Draw ${toLabel(state.drawPile.length)}, Discard ${toLabel(state.discardPile.length)}, Deck ${getDeckCountLabel(state)}`,
          {
            size: 20,
          },
        ),
        color(155, 166, 196),
        fixed(),
        pos(40, 124),
      ]),
    )
  }

  const renderEnemyPanel = (state: CombatState) => {
    const panelX = width() - 300
    const panelY = 24

    track(
      add([
        rect(250, 192, { radius: 22 }),
        color(38, 29, 44),
        outline(4, rgb(195, 141, 138)),
        fixed(),
        pos(panelX, panelY),
      ]),
    )

    track(
      add([
        text(state.enemy.label, {
          size: 28,
        }),
        color(255, 226, 216),
        fixed(),
        pos(panelX + 20, panelY + 22),
      ]),
    )

    track(
      add([
        text(
          `HP ${toLabel(state.enemy.health)}/${toLabel(state.enemy.maxHealth)}`,
          {
            size: 20,
          },
        ),
        color(251, 214, 198),
        fixed(),
        pos(panelX + 20, panelY + 66),
      ]),
    )

    track(
      add([
        text(
          `Block ${toLabel(state.enemy.block)}, Burn ${toLabel(state.enemy.burn)}`,
          {
            size: 18,
          },
        ),
        color(255, 183, 120),
        fixed(),
        pos(panelX + 20, panelY + 94),
      ]),
    )

    const intent = state.enemy.intents[state.enemy.intentCursor]

    track(
      add([
        text(`Intent: ${intent.label}`, {
          size: 18,
        }),
        color(174, 208, 255),
        fixed(),
        pos(panelX + 20, panelY + 118),
      ]),
    )

    track(
      add([
        text(intent.description, {
          size: 18,
          width: 220,
        }),
        color(214, 224, 250),
        fixed(),
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

    track(
      add([
        rect(width() - 80, panelHeight, { radius: 20 }),
        color(23, 31, 48),
        outline(4, rgb(88, 112, 162)),
        fixed(),
        pos(panelX, panelY),
      ]),
    )

    track(
      add([
        text('Chain Builder', {
          size: 24,
        }),
        color(235, 241, 255),
        fixed(),
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
        fixed(),
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
        fixed(),
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
        play(SOUND.DROP)
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
    const cards = state.hand
    const totalWidth =
      cards.length * CARD.WIDTH + Math.max(cards.length - 1, 0) * 16
    const startX = Math.max(18, width() / 2 - totalWidth / 2)
    const y = height() - CARD.HEIGHT - 84

    cards.forEach((card, index) => {
      renderCard(state, card, startX + index * (CARD.WIDTH + 16), y)
    })
  }

  const renderCard = (
    state: CombatState,
    card: CardInstance,
    x: number,
    y: number,
  ) => {
    const definition = getCardDefinition(card.cardId)
    const disabledReason = getCardCommitDisabledReason(state, card)
    const disabled = Boolean(disabledReason)

    const cardObjects = addCard({
      card,
      definition,
      disabled,
      disabledReason,
      onClick: (selectedCard) => {
        stateManager.commitChainCard(selectedCard.instanceId)
      },
      x,
      y,
    })
    trackAll(cardObjects.objects)
  }

  const renderFooter = (state: CombatState) => {
    track(
      add([
        text(state.message, {
          size: 20,
          width: width() - 80,
        }),
        color(218, 226, 246),
        fixed(),
        pos(40, height() - 42),
      ]),
    )
  }

  const renderUi = (state: CombatState) => {
    clearUi()
    renderHeader(state)
    renderEnemyPanel(state)
    renderBuilderPanel(state)
    renderActionButtons(state)
    renderHand(state)
    renderFooter(state)
  }

  onKeyPress('escape', () => {
    go(SCENE.TITLE)
  })

  const unsubscribe = stateManager.subscribe(({ endStatus, route, state }) => {
    switch (route) {
      case 'reward':
        go(SCENE.REWARD)
        return
      case 'end':
        if (endStatus) {
          go(SCENE.END, endStatus)
        }
        return
      case 'game':
        renderUi(state)
        return
    }
  })

  add([pos(0, 0)]).onDestroy(() => {
    unsubscribe()
    clearUi()
  })

  renderBackground()
  const initialSnapshot = stateManager.getSnapshot()

  switch (initialSnapshot.route) {
    case 'reward':
      go(SCENE.REWARD)
      return
    case 'end':
      if (initialSnapshot.endStatus) {
        go(SCENE.END, initialSnapshot.endStatus)
      }
      return
    case 'game':
      renderUi(initialSnapshot.state)
      return
  }
})
