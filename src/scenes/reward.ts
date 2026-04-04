import {
  getCardRewardDefinitions,
  getHpRewardOptions,
  getUpgradeRewardDefinitions,
} from '../combat'
import { CARD, POSITION, SCENE, SOUND, THEME } from '../constants'
import {
  addBackdrop,
  addButton,
  addCard,
  addMessage,
  addStatus,
} from '../gameobjects'
import { getStateManager } from '../state'
import type { Card, CombatState } from '../types'

const REWARD_CONTAINER_HEIGHT = 560
const REWARD_CONTAINER_WIDTH = 680
const REWARD_CARD_GAP = 170

const REWARD_TITLE_Y_OFFSET = -225
const REWARD_SUBTITLE_Y_OFFSET = -160
const REWARD_CARD_Y_OFFSET = 25
const REWARD_SKIP_BUTTON_Y_OFFSET = 210

const HP_REWARD_BUTTON_WIDTH = CARD.WIDTH + 20
const HP_REWARD_BUTTON_HEIGHT = CARD.HEIGHT - 80

scene(SCENE.REWARD, () => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))
  const stateManager = getStateManager()
  const state = stateManager.getState()
  const { x: centerX, y: centerY } = center()

  addBackdrop({
    actionAreaTop: height() * 0.48,
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

    case 'card':
      renderCardRewardStep(state)
      return
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
      text('Recover full health or increase your maximum HP.', {
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
          go(SCENE.REWARD)
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
        go(SCENE.REWARD)
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
          go(SCENE.GAME)
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
        go(SCENE.GAME)
      },
      width: 200,
      x: centerX,
      y: centerY + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
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
          go(SCENE.REWARD)
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
        go(SCENE.REWARD)
      },
      width: 200,
      x: centerX,
      y: centerY + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }
})
