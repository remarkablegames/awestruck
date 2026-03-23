import {
  cancelBuilder,
  commitChainCard,
  confirmBuilder,
  createInitialState,
  endTurn,
  getCardCommitDisabledReason,
  getCardDefinition,
  getChainPreview,
  getDeckCountLabel,
} from '../combat'
import { DATA, SCENE, SOUND, TAG, THEME } from '../constants'
import { addButton, addCard, CARD_HEIGHT, CARD_WIDTH } from '../gameobjects'
import type { CardInstance, CombatState } from '../types'

const ACTION_AREA_TOP_RATIO = 0.42
const ACTION_BUTTON_OFFSET_Y = 60
const BUILDER_PANEL_OFFSET_Y = 10
const END_TURN_BUTTON_OFFSET_Y = -42
const toLabel = (value: number) => String(value)

scene(SCENE.GAME, (incomingState?: CombatState) => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))

  const bestFloor = getData<number>(DATA.BEST_FLOOR, 0) ?? 0
  const state = incomingState ?? createInitialState(bestFloor)

  const persistProgress = () => {
    const savedBestFloor = getData<number>(DATA.BEST_FLOOR, 0) ?? 0

    if (state.bestFloor > savedBestFloor) {
      setData(DATA.BEST_FLOOR, state.bestFloor)
    }
  }

  const runAction = (action: () => void) => {
    action()
    persistProgress()
    go(SCENE.GAME, state)
  }

  const renderBackground = () => {
    const actionAreaTop = height() * ACTION_AREA_TOP_RATIO

    add([
      rect(width(), height()),
      color(...THEME.GAME_BACKGROUND_COLOR),
      fixed(),
      pos(0, 0),
      TAG.UI,
    ])

    add([
      rect(width(), actionAreaTop),
      color(...THEME.GAME_BACKGROUND_COLOR),
      fixed(),
      pos(0, 0),
      opacity(0.9),
      TAG.UI,
    ])

    add([
      rect(width(), height() - actionAreaTop),
      color(...THEME.GAME_LOWER_BACKGROUND_COLOR),
      fixed(),
      pos(0, actionAreaTop),
      opacity(0.95),
      TAG.UI,
    ])
  }

  const renderHeader = () => {
    add([
      text(`Floor ${toLabel(state.floor)}, Turn ${toLabel(state.turn)}`, {
        size: 26,
      }),
      color(247, 232, 179),
      fixed(),
      pos(40, 28),
      TAG.UI,
    ])

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
      TAG.UI,
    ])

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
      TAG.UI,
    ])

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
      TAG.UI,
    ])
  }

  const renderEnemyPanel = () => {
    const panelX = width() - 300
    const panelY = 24

    add([
      rect(250, 192, { radius: 22 }),
      color(38, 29, 44),
      outline(4, rgb(195, 141, 138)),
      fixed(),
      pos(panelX, panelY),
      TAG.UI,
    ])

    add([
      text(state.enemy.label, {
        size: 28,
      }),
      color(255, 226, 216),
      fixed(),
      pos(panelX + 20, panelY + 22),
      TAG.UI,
    ])

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
      TAG.UI,
    ])

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
      TAG.UI,
    ])

    const intent = state.enemy.intents[state.enemy.intentCursor]

    add([
      text(`Intent: ${intent.label}`, {
        size: 18,
      }),
      color(174, 208, 255),
      fixed(),
      pos(panelX + 20, panelY + 118),
      TAG.UI,
    ])

    add([
      text(intent.description, {
        size: 18,
        width: 220,
      }),
      color(214, 224, 250),
      fixed(),
      pos(panelX + 20, panelY + 142),
      TAG.UI,
    ])
  }

  const renderBuilderPanel = () => {
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

    add([
      rect(width() - 80, panelHeight, { radius: 20 }),
      color(23, 31, 48),
      outline(4, rgb(88, 112, 162)),
      fixed(),
      pos(panelX, panelY),
      TAG.UI,
    ])

    add([
      text('Chain Builder', {
        size: 24,
      }),
      color(235, 241, 255),
      fixed(),
      pos(panelX + 24, panelY + 18),
      TAG.UI,
    ])

    add([
      text(builderLabel || 'No words committed', {
        size: 22,
        width: previewWidth,
      }),
      color(248, 229, 170),
      fixed(),
      pos(panelX + 24, panelY + 56),
      TAG.UI,
    ])

    add([
      text(previewText, {
        size: 20,
        width: previewWidth,
      }),
      color(181, 198, 236),
      fixed(),
      pos(panelX + 24, panelY + 86),
      TAG.UI,
    ])
  }

  const renderActionButtons = () => {
    const actionAreaTop = height() * ACTION_AREA_TOP_RATIO
    const preview = getChainPreview(state.builder)

    addButton({
      disabled: state.status !== 'playerTurn' || preview.status !== 'ready',
      fillColor: [111, 168, 101],
      height: 54,
      label: 'Execute',
      onClick: () => {
        play(SOUND.DROP)
        runAction(() => {
          confirmBuilder(state)
        })
      },
      width: 150,
      x: width() - 305,
      y: actionAreaTop + ACTION_BUTTON_OFFSET_Y,
    })

    addButton({
      disabled: state.status !== 'playerTurn' || !state.builder.length,
      fillColor: [176, 119, 93],
      height: 54,
      label: 'Cancel',
      onClick: () => {
        play(SOUND.BACK)
        runAction(() => {
          cancelBuilder(state)
        })
      },
      width: 150,
      x: width() - 140,
      y: actionAreaTop + ACTION_BUTTON_OFFSET_Y,
    })

    addButton({
      disabled: state.status !== 'playerTurn',
      fillColor: [92, 130, 208],
      height: 52,
      label: 'End Turn',
      onClick: () => {
        play(SOUND.DROP)
        runAction(() => {
          endTurn(state)
        })
      },
      width: 150,
      x: width() - 140,
      y: actionAreaTop + END_TURN_BUTTON_OFFSET_Y,
    })
  }

  const renderHand = () => {
    const cards = state.hand
    const totalWidth =
      cards.length * CARD_WIDTH + Math.max(cards.length - 1, 0) * 16
    const startX = Math.max(18, width() / 2 - totalWidth / 2)
    const y = height() - CARD_HEIGHT - 84

    cards.forEach((card, index) => {
      renderCard(card, startX + index * (CARD_WIDTH + 16), y)
    })
  }

  const renderCard = (card: CardInstance, x: number, y: number) => {
    const definition = getCardDefinition(card.cardId)
    const disabledReason = getCardCommitDisabledReason(state, card)
    const disabled = Boolean(disabledReason)

    addCard({
      card,
      definition,
      disabled,
      disabledReason,
      onClick: (selectedCard) => {
        runAction(() => {
          commitChainCard(state, selectedCard.instanceId)
        })
      },
      x,
      y,
    })
  }

  const renderFooter = () => {
    add([
      text(state.message, {
        size: 20,
        width: width() - 80,
      }),
      color(218, 226, 246),
      fixed(),
      pos(40, height() - 42),
      TAG.UI,
    ])
  }

  onKeyPress('escape', () => {
    go(SCENE.TITLE)
  })

  persistProgress()

  if (state.status === 'reward') {
    go(SCENE.REWARD, state)
    return
  }

  if (state.status === 'won' || state.status === 'lost') {
    go(SCENE.END, state.status)
    return
  }

  renderBackground()
  renderHeader()
  renderEnemyPanel()
  renderBuilderPanel()
  renderActionButtons()
  renderHand()
  renderFooter()
})
