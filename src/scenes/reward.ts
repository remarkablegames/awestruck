import {
  getCardRewardDefinitions,
  getHpRewardOptions,
  getRelicRewardDefinitions,
  getUpgradeRewardDefinitions,
} from '../combat'
import { CARD, POSITION, SCENE, SOUND } from '../constants'
import {
  addBackdrop,
  addButton,
  addCard,
  addMessage,
  addStatus,
  getBackdropPalette,
} from '../gameobjects'
import { getStateManager } from '../state'
import type { Card, CombatState, RelicDefinition } from '../types'

const REWARD_CONTAINER_HEIGHT = 560
const REWARD_CONTAINER_WIDTH = 680
const REWARD_CARD_GAP = 170

const REWARD_TITLE_Y_OFFSET = -225
const REWARD_SUBTITLE_Y_OFFSET = -160
const REWARD_CARD_Y_OFFSET = 25
const REWARD_SKIP_BUTTON_Y_OFFSET = 210

const HP_REWARD_BUTTON_WIDTH = CARD.WIDTH + 20
const HP_REWARD_BUTTON_HEIGHT = CARD.HEIGHT - 80

const RELIC_BUTTON_WIDTH = 180
const RELIC_BUTTON_HEIGHT = 180
const RELIC_BUTTON_SPACING = 16
const RELIC_BUTTON_TITLE_OFFSET_Y = -50
const RELIC_BUTTON_DESCRIPTION_OFFSET_Y = 24

scene(SCENE.REWARD, () => {
  const stateManager = getStateManager()
  const state = stateManager.getState()
  const backdropPalette = getBackdropPalette(state.floor)
  const { x: centerX, y: centerY } = center()

  setBackground(...backdropPalette.gameBackgroundColor)

  addBackdrop({
    actionAreaTop: height() * 0.48,
    floor: state.floor,
    overlayOpacity: 0.08,
  })

  add([rect(width(), height()), color(5, 8, 12), opacity(0.62)])

  addStatus({
    state,
    ...POSITION.STATUS,
  })

  addMessage({
    message: state.message,
    width: width() - 80,
    ...POSITION.MESSAGE,
  })

  add([
    rect(REWARD_CONTAINER_WIDTH, REWARD_CONTAINER_HEIGHT, { radius: 26 }),
    color(29, 38, 58),
    outline(4, rgb(196, 211, 246)),
    pos(center()),
    anchor('center'),
  ])

  switch (state.rewardPhase) {
    case 'hp':
      renderHpRewardStep(state)
      return

    case 'upgrade':
      renderUpgradeRewardStep(state)
      return

    case 'relic':
      renderRelicRewardStep(state)
      return

    case 'card':
      renderCardRewardStep(state)
      return
  }

  function navigateToCurrentScene() {
    go(stateManager.getSnapshot().scene)
  }

  function renderHpRewardStep(currentState: CombatState) {
    add([
      text('Improve Your Vitality', {
        align: 'center',
        size: 38,
        width: 560,
      }),
      color(248, 232, 181),
      pos(centerX, centerY + REWARD_TITLE_Y_OFFSET),
      anchor('center'),
    ])

    add([
      text('Recover to full health or increase your maximum HP.', {
        align: 'center',
        size: 24,
        width: 560,
      }),
      color(222, 229, 248),
      pos(centerX, centerY + REWARD_SUBTITLE_Y_OFFSET + 10),
      anchor('center'),
    ])

    getHpRewardOptions(currentState).forEach((reward, index) => {
      const x =
        centerX -
        HP_REWARD_BUTTON_WIDTH / 2 +
        index * (HP_REWARD_BUTTON_WIDTH + 20)
      const y = centerY + REWARD_CARD_Y_OFFSET

      addButton({
        buttonComps: [outline(4, rgb(196, 216, 255))],
        fillColor:
          reward.type === 'fullHeal' ? [110, 168, 101] : [92, 130, 208],
        height: HP_REWARD_BUTTON_HEIGHT,
        label: reward.label,
        labelSize: 26,
        onClick: () => {
          play(reward.type === 'fullHeal' ? SOUND.HEAL : SOUND.BLOCK)
          stateManager.chooseHpReward(reward.type)
          navigateToCurrentScene()
        },
        width: HP_REWARD_BUTTON_WIDTH,
        x,
        y,
      })
    })

    addButton({
      fillColor: [124, 106, 164],
      height: 50,
      label: 'Skip Reward',
      onClick: () => {
        play(SOUND.BACK)
        stateManager.skipHpReward()
        navigateToCurrentScene()
      },
      width: 200,
      x: centerX,
      y: centerY + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }

  function renderCardRewardStep(currentState: CombatState) {
    add([
      text('Choose 1 Card', {
        align: 'center',
        size: 38,
        width: 560,
      }),
      color(248, 232, 181),
      pos(centerX, centerY + REWARD_TITLE_Y_OFFSET),
      anchor('center'),
    ])

    add([
      text('Add a card to your deck before entering the next floor.', {
        align: 'center',
        size: 24,
        width: 560,
      }),
      color(222, 229, 248),
      pos(centerX, centerY + REWARD_SUBTITLE_Y_OFFSET),
      anchor('center'),
    ])

    getCardRewardDefinitions(currentState).forEach((definition, index) => {
      const x = centerX - REWARD_CARD_GAP + index * REWARD_CARD_GAP
      const y = centerY + REWARD_CARD_Y_OFFSET

      addCard({
        definition,
        onClick: () => {
          play(SOUND.DROP)
          stateManager.chooseCardReward(definition.id as Card)
          navigateToCurrentScene()
        },
        x,
        y,
      })
    })

    addButton({
      fillColor: [92, 130, 208],
      height: 50,
      label: 'Skip Reward',
      onClick: () => {
        play(SOUND.BACK)
        stateManager.skipCardReward()
        navigateToCurrentScene()
      },
      width: 200,
      x: centerX,
      y: centerY + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }

  function renderRelicRewardStep(currentState: CombatState) {
    const relics = getRelicRewardDefinitions(currentState)

    add([
      text('Claim 1 Relic', {
        align: 'center',
        size: 38,
        width: 560,
      }),
      color(248, 232, 181),
      pos(centerX, centerY + REWARD_TITLE_Y_OFFSET),
      anchor('center'),
    ])

    add([
      text('Select a relic that triggers at the start of every turn.', {
        align: 'center',
        size: 24,
        width: 560,
      }),
      color(222, 229, 248),
      pos(centerX, centerY + REWARD_SUBTITLE_Y_OFFSET),
      anchor('center'),
    ])

    const totalWidth =
      relics.length * RELIC_BUTTON_WIDTH +
      (relics.length - 1) * RELIC_BUTTON_SPACING

    relics.forEach((relic, index) => {
      const x =
        centerX -
        totalWidth / 2 +
        RELIC_BUTTON_WIDTH / 2 +
        index * (RELIC_BUTTON_WIDTH + RELIC_BUTTON_SPACING)
      const y = centerY + REWARD_CARD_Y_OFFSET

      renderRelicButton({
        relic,
        x,
        y,
      })
    })

    addButton({
      fillColor: [124, 106, 164],
      height: 50,
      label: 'Skip Reward',
      onClick: () => {
        play(SOUND.BACK)
        stateManager.skipRelicReward()
        navigateToCurrentScene()
      },
      width: 200,
      x: centerX,
      y: centerY + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }

  function renderRelicButton({
    relic,
    x,
    y,
  }: {
    relic: RelicDefinition
    x: number
    y: number
  }) {
    addButton({
      buttonComps: [outline(4, rgb(255, 186, 159))],
      fillColor:
        relic.id === 'overdrive'
          ? [176, 93, 93]
          : relic.id === 'aegis'
            ? [92, 124, 192]
            : [94, 146, 112],
      height: RELIC_BUTTON_HEIGHT,
      label: '',
      labelSize: 26,
      onClick: () => {
        play(SOUND.DROP)
        stateManager.chooseRelicReward(relic.id)
        navigateToCurrentScene()
      },
      width: RELIC_BUTTON_WIDTH,
      x,
      y,
    })

    add([
      text(relic.label, {
        align: 'center',
        size: 24,
        width: RELIC_BUTTON_WIDTH - 28,
      }),
      color(247, 249, 255),
      pos(x, y + RELIC_BUTTON_TITLE_OFFSET_Y),
      anchor('center'),
    ])

    add([
      text(relic.description, {
        align: 'center',
        size: 18,
        width: RELIC_BUTTON_WIDTH - 28,
      }),
      color(240, 233, 244),
      pos(x, y + RELIC_BUTTON_DESCRIPTION_OFFSET_Y),
      anchor('center'),
    ])
  }

  function renderUpgradeRewardStep(currentState: CombatState) {
    add([
      text('Upgrade 1 Card', {
        align: 'center',
        size: 38,
        width: 560,
      }),
      color(248, 232, 181),
      pos(centerX, centerY + REWARD_TITLE_Y_OFFSET),
      anchor('center'),
    ])

    add([
      text('Improve a card from your deck before choosing a new reward card.', {
        align: 'center',
        size: 24,
        width: 560,
      }),
      color(222, 229, 248),
      pos(centerX, centerY + REWARD_SUBTITLE_Y_OFFSET),
      anchor('center'),
    ])

    getUpgradeRewardDefinitions(currentState).forEach((option, index) => {
      const x = centerX - REWARD_CARD_GAP + index * REWARD_CARD_GAP
      const y = centerY + REWARD_CARD_Y_OFFSET

      addCard({
        definition: option.definition,
        onClick: () => {
          play(SOUND.DROP)
          stateManager.chooseUpgradeReward(option.instanceId)
          navigateToCurrentScene()
        },
        x,
        y,
      })
    })

    addButton({
      fillColor: [124, 106, 164],
      height: 50,
      label: 'Skip Reward',
      onClick: () => {
        play(SOUND.BACK)
        stateManager.skipUpgradeReward()
        navigateToCurrentScene()
      },
      width: 200,
      x: centerX,
      y: centerY + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }
})
