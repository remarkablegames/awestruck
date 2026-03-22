import {
  cancelBuilder,
  chooseReward,
  commitChainCard,
  confirmBuilder,
  createInitialState,
  endTurn,
  getCardDefinition,
  getChainPreview,
  getDeckCountLabel,
  getRewardDefinitions,
  playUtilityCard,
} from '../combat'
import { SAVE_KEY, SCENE, TAG } from '../constants'
import type { CardInstance, CombatState } from '../types'

const CARD_WIDTH = 156
const CARD_HEIGHT = 244
const toLabel = (value: number) => String(value)

scene(SCENE.GAME, (incomingState?: CombatState) => {
  setBackground(rgb(10, 14, 24))

  const bestFloor = getData<number>(SAVE_KEY.BEST_FLOOR, 0) ?? 0
  const state = incomingState ?? createInitialState(bestFloor)

  const persistProgress = () => {
    const savedBestFloor = getData<number>(SAVE_KEY.BEST_FLOOR, 0) ?? 0

    if (state.bestFloor > savedBestFloor) {
      setData(SAVE_KEY.BEST_FLOOR, state.bestFloor)
    }
  }

  const runAction = (action: () => void) => {
    action()
    persistProgress()
    go(SCENE.GAME, state)
  }

  const addButton = ({
    action,
    disabled = false,
    fillColor,
    height,
    label,
    width: buttonWidth,
    x,
    y,
  }: {
    action: () => void
    disabled?: boolean
    fillColor: [number, number, number]
    height: number
    label: string
    width: number
    x: number
    y: number
  }) => {
    const button = add([
      rect(buttonWidth, height, { radius: 18 }),
      area(),
      color(
        disabled ? 74 : fillColor[0],
        disabled ? 82 : fillColor[1],
        disabled ? 104 : fillColor[2],
      ),
      outline(3, rgb(205, 219, 255)),
      fixed(),
      pos(x, y),
      anchor('center'),
      z(20),
      TAG.UI,
    ])

    if (!disabled) {
      button.onHover(() => {
        button.color = rgb(
          Math.min(fillColor[0] + 18, 255),
          Math.min(fillColor[1] + 18, 255),
          Math.min(fillColor[2] + 18, 255),
        )
      })

      button.onHoverEnd(() => {
        button.color = rgb(fillColor[0], fillColor[1], fillColor[2])
      })

      button.onClick(action)
    }

    add([
      text(label, {
        align: 'center',
        size: 20,
        width: buttonWidth - 24,
      }),
      color(247, 249, 255),
      fixed(),
      pos(x, y),
      anchor('center'),
      z(21),
      TAG.UI,
    ])
  }

  const renderBackground = () => {
    add([
      rect(width(), height()),
      color(10, 14, 24),
      fixed(),
      pos(0, 0),
      TAG.UI,
    ])

    add([
      rect(width(), height() * 0.42),
      color(19, 28, 48),
      fixed(),
      pos(0, 0),
      opacity(0.9),
      TAG.UI,
    ])

    add([
      rect(width(), height() * 0.4),
      color(17, 24, 38),
      fixed(),
      pos(0, height() * 0.6),
      opacity(0.95),
      TAG.UI,
    ])
  }

  const renderHeader = () => {
    add([
      text(`Floor ${toLabel(state.floor)}  Turn ${toLabel(state.turn)}`, {
        size: 26,
      }),
      color(247, 232, 179),
      fixed(),
      pos(40, 28),
      TAG.UI,
    ])

    add([
      text(
        `Player ${toLabel(state.player.health)}/${toLabel(state.player.maxHealth)} HP`,
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
        `Block ${toLabel(state.player.block)}  Energy ${toLabel(state.player.energy)}/${toLabel(state.player.maxEnergy)}`,
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
        `Draw ${toLabel(state.drawPile.length)}  Discard ${toLabel(state.discardPile.length)}  Deck ${getDeckCountLabel(state)}`,
        {
          size: 18,
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
      rect(250, 168, { radius: 22 }),
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
      pos(panelX + 24, panelY + 22),
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
      pos(panelX + 24, panelY + 66),
      TAG.UI,
    ])

    add([
      text(
        `Block ${toLabel(state.enemy.block)}  Burn ${toLabel(state.enemy.burn)}`,
        {
          size: 16,
        },
      ),
      color(255, 183, 120),
      fixed(),
      pos(panelX + 24, panelY + 94),
      TAG.UI,
    ])

    const intent = state.enemy.intents[state.enemy.intentCursor]

    add([
      text(`Intent: ${intent.label}`, {
        size: 18,
      }),
      color(174, 208, 255),
      fixed(),
      pos(panelX + 24, panelY + 118),
      TAG.UI,
    ])

    add([
      text(intent.description, {
        size: 16,
        width: 204,
      }),
      color(214, 224, 250),
      fixed(),
      pos(panelX + 24, panelY + 142),
      TAG.UI,
    ])
  }

  const renderBuilderPanel = () => {
    const panelX = 40
    const panelY = 204
    const preview = getChainPreview(state.builder)
    const previewWidth = width() - 660
    const builderLabel = state.builder
      .map((card) => getCardDefinition(card.cardId).label)
      .join(' + ')
    const previewText = preview.previewText

    add([
      rect(width() - 80, 120, { radius: 20 }),
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
        size: 16,
        width: previewWidth,
      }),
      color(181, 198, 236),
      fixed(),
      pos(panelX + 24, panelY + 86),
      TAG.UI,
    ])
  }

  const renderActionButtons = () => {
    const preview = getChainPreview(state.builder)

    addButton({
      action: () => {
        runAction(() => {
          confirmBuilder(state)
        })
      },
      disabled: state.status !== 'playerTurn' || preview.status !== 'ready',
      fillColor: [111, 168, 101],
      height: 54,
      label: 'Confirm Chain',
      width: 210,
      x: width() - 360,
      y: 256,
    })

    addButton({
      action: () => {
        runAction(() => {
          cancelBuilder(state)
        })
      },
      disabled: state.status !== 'playerTurn' || state.builder.length === 0,
      fillColor: [176, 119, 93],
      height: 54,
      label: 'Cancel',
      width: 150,
      x: width() - 170,
      y: 256,
    })

    addButton({
      action: () => {
        runAction(() => {
          endTurn(state)
        })
      },
      disabled: state.status !== 'playerTurn',
      fillColor: [92, 130, 208],
      height: 58,
      label: 'End Turn',
      width: 180,
      x: width() - 208,
      y: 418,
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
    const disabled =
      state.status !== 'playerTurn' || state.player.energy < definition.cost

    const panel = add([
      rect(CARD_WIDTH, CARD_HEIGHT, { radius: 18 }),
      area(),
      color(
        disabled ? 75 : definition.accent[0],
        disabled ? 81 : definition.accent[1],
        disabled ? 98 : definition.accent[2],
      ),
      outline(3, rgb(229, 233, 246)),
      fixed(),
      pos(x, y),
      z(10),
      TAG.UI,
    ])

    if (!disabled) {
      panel.onHover(() => {
        panel.color = rgb(
          Math.min(definition.accent[0] + 18, 255),
          Math.min(definition.accent[1] + 18, 255),
          Math.min(definition.accent[2] + 18, 255),
        )
      })

      panel.onHoverEnd(() => {
        panel.color = rgb(
          definition.accent[0],
          definition.accent[1],
          definition.accent[2],
        )
      })

      panel.onClick(() => {
        if (definition.type !== 'utility') {
          runAction(() => {
            commitChainCard(state, card.instanceId)
          })
          return
        }

        runAction(() => {
          playUtilityCard(state, card.instanceId)
        })
      })
    }

    add([
      text(definition.label, {
        align: 'center',
        size: 30,
        width: CARD_WIDTH - 18,
      }),
      color(15, 20, 28),
      fixed(),
      pos(x + CARD_WIDTH / 2, y + 34),
      anchor('center'),
      z(11),
      TAG.UI,
    ])

    add([
      rect(34, 34, { radius: 10 }),
      color(28, 36, 52),
      outline(2, rgb(245, 247, 255)),
      fixed(),
      pos(x - 14, y - 10),
      z(11),
      TAG.UI,
    ])

    add([
      text(toLabel(definition.cost), {
        align: 'center',
        size: 20,
        width: 34,
      }),
      color(245, 247, 255),
      fixed(),
      pos(x + 3, y + 7),
      anchor('center'),
      z(12),
      TAG.UI,
    ])

    add([
      text(toRoleLabel(definition.type), {
        align: 'center',
        size: 18,
        width: CARD_WIDTH - 18,
      }),
      color(32, 44, 62),
      fixed(),
      pos(x + CARD_WIDTH / 2, y + 78),
      anchor('center'),
      z(11),
      TAG.UI,
    ])

    add([
      text(definition.description, {
        size: 18,
        width: CARD_WIDTH - 24,
      }),
      color(27, 35, 48),
      fixed(),
      pos(x + 14, y + 118),
      z(11),
      TAG.UI,
    ])
  }

  const renderFooter = () => {
    add([
      text(state.message, {
        size: 18,
        width: width() - 80,
      }),
      color(218, 226, 246),
      fixed(),
      pos(40, height() - 42),
      TAG.UI,
    ])
  }

  const toRoleLabel = (type: 'modifier' | 'payload' | 'utility') => {
    switch (type) {
      case 'modifier':
        return 'Modifier'
      case 'payload':
        return 'Payload'
      case 'utility':
        return 'Utility'
    }
  }

  const renderOverlayPanel = (title: string, subtitle: string) => {
    add([
      rect(width(), height()),
      color(5, 8, 12),
      opacity(0.72),
      fixed(),
      pos(0, 0),
      z(30),
      TAG.UI,
    ])

    add([
      rect(640, 340, { radius: 26 }),
      color(29, 38, 58),
      outline(4, rgb(196, 211, 246)),
      fixed(),
      pos(width() / 2, height() / 2),
      anchor('center'),
      z(31),
      TAG.UI,
    ])

    add([
      text(title, {
        align: 'center',
        size: 38,
        width: 520,
      }),
      color(248, 232, 181),
      fixed(),
      pos(width() / 2, height() / 2 - 112),
      anchor('center'),
      z(32),
      TAG.UI,
    ])

    add([
      text(subtitle, {
        align: 'center',
        size: 20,
        width: 520,
      }),
      color(222, 229, 248),
      fixed(),
      pos(width() / 2, height() / 2 - 56),
      anchor('center'),
      z(32),
      TAG.UI,
    ])
  }

  const renderRewardOverlay = () => {
    renderOverlayPanel(
      'Choose A Reward',
      'Pick one new card before entering the next Archivist floor.',
    )

    getRewardDefinitions(state).forEach((definition, index) => {
      const x = width() / 2 - 196 + index * 196
      const y = height() / 2 + 30
      const panel = add([
        rect(164, 186, { radius: 20 }),
        area(),
        color(definition.accent[0], definition.accent[1], definition.accent[2]),
        outline(3, rgb(239, 242, 249)),
        fixed(),
        pos(x, y),
        anchor('center'),
        z(33),
        TAG.UI,
      ])

      panel.onHover(() => {
        panel.color = rgb(
          Math.min(definition.accent[0] + 18, 255),
          Math.min(definition.accent[1] + 18, 255),
          Math.min(definition.accent[2] + 18, 255),
        )
      })

      panel.onHoverEnd(() => {
        panel.color = rgb(
          definition.accent[0],
          definition.accent[1],
          definition.accent[2],
        )
      })

      panel.onClick(() => {
        runAction(() => {
          chooseReward(state, definition.id)
        })
      })

      add([
        text(definition.label, {
          align: 'center',
          size: 28,
          width: 132,
        }),
        color(15, 20, 28),
        fixed(),
        pos(x, y - 48),
        anchor('center'),
        z(34),
        TAG.UI,
      ])

      add([
        text(definition.description, {
          align: 'center',
          size: 16,
          width: 132,
        }),
        color(24, 31, 44),
        fixed(),
        pos(x, y + 18),
        anchor('center'),
        z(34),
        TAG.UI,
      ])
    })
  }

  const renderRunEndOverlay = () => {
    renderOverlayPanel(
      state.status === 'won' ? 'Run Complete' : 'Run Lost',
      state.status === 'won'
        ? 'You cleared all three floors and preserved the lexicon.'
        : 'The Archivist won this run. Start again and tune the deck.',
    )

    addButton({
      action: () => {
        go(SCENE.GAME)
      },
      fillColor: [92, 130, 208],
      height: 58,
      label: 'Restart Run',
      width: 196,
      x: width() / 2 - 112,
      y: height() / 2 + 104,
    })

    addButton({
      action: () => {
        go(SCENE.TITLE)
      },
      fillColor: [124, 106, 164],
      height: 58,
      label: 'Back To Title',
      width: 196,
      x: width() / 2 + 112,
      y: height() / 2 + 104,
    })
  }

  onKeyPress('escape', () => {
    go(SCENE.TITLE)
  })

  persistProgress()
  renderBackground()
  renderHeader()
  renderEnemyPanel()
  renderBuilderPanel()
  renderActionButtons()
  renderHand()
  renderFooter()

  if (state.status === 'reward') {
    renderRewardOverlay()
  }

  if (state.status === 'won' || state.status === 'lost') {
    renderRunEndOverlay()
  }
})
