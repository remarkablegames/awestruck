import { getCardRewardDefinitions, getHpRewardOptions } from '../combat'
import { SCENE, SOUND, THEME } from '../constants'
import { addBackdrop, addButton, addCard } from '../gameobjects'
import { getStateManager } from '../state'
import type { Card, CombatState } from '../types'

const REWARD_CONTAINER_HEIGHT = 560
const REWARD_CONTAINER_WIDTH = 680
const REWARD_CARD_GAP = 170

const REWARD_TITLE_Y_OFFSET = -225
const REWARD_SUBTITLE_Y_OFFSET = -175
const REWARD_CARD_Y_OFFSET = 20
const REWARD_SKIP_BUTTON_Y_OFFSET = 220

const HP_REWARD_BUTTON_WIDTH = 220
const HP_REWARD_BUTTON_HEIGHT = 120
const HP_REWARD_BUTTON_GAP = 250

scene(SCENE.REWARD, () => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))
  const stateManager = getStateManager()
  const state = stateManager.getState()

  addBackdrop({
    actionAreaTop: height() * 0.48,
    overlayOpacity: 0.08,
  })

  add([rect(width(), height()), color(5, 8, 12), opacity(0.62)])

  add([
    rect(REWARD_CONTAINER_WIDTH, REWARD_CONTAINER_HEIGHT, { radius: 26 }),
    color(29, 38, 58),
    outline(4, rgb(196, 211, 246)),
    pos(center()),
    anchor('center'),
  ])

  if (state.rewardPhase === 'hp') {
    renderHpRewardStep(state)
    return
  }

  renderCardRewardStep(state)

  function renderHpRewardStep(currentState: CombatState) {
    add([
      text('Choose a Vitality Reward', {
        align: 'center',
        size: 38,
        width: 560,
      }),
      color(248, 232, 181),
      pos(center().x, center().y + REWARD_TITLE_Y_OFFSET),
      anchor('center'),
    ])

    add([
      text('Recover now or grow your maximum HP before picking a card.', {
        align: 'center',
        size: 24,
        width: 560,
      }),
      color(222, 229, 248),
      pos(center().x, center().y + REWARD_SUBTITLE_Y_OFFSET),
      anchor('center'),
    ])

    getHpRewardOptions(currentState).forEach((reward, index) => {
      const x =
        center().x - HP_REWARD_BUTTON_GAP / 2 + index * HP_REWARD_BUTTON_GAP
      const y = center().y + REWARD_CARD_Y_OFFSET

      addButton({
        buttonComps: [outline(4, rgb(196, 216, 255))],
        fillColor:
          reward.kind === 'fullHeal' ? [110, 168, 101] : [92, 130, 208],
        height: HP_REWARD_BUTTON_HEIGHT,
        label: reward.label,
        labelSize: 26,
        onClick: () => {
          play(reward.kind === 'fullHeal' ? SOUND.HEAL : SOUND.DROP)
          stateManager.chooseHpReward(reward.kind)
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
      x: center().x,
      y: center().y + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }

  function renderCardRewardStep(currentState: CombatState) {
    add([
      text('Choose A Card Reward', {
        align: 'center',
        size: 38,
        width: 560,
      }),
      color(248, 232, 181),
      pos(center().x, center().y + REWARD_TITLE_Y_OFFSET),
      anchor('center'),
    ])

    add([
      text('Pick one new card before entering the next floor.', {
        align: 'center',
        size: 20,
        width: 560,
      }),
      color(222, 229, 248),
      pos(center().x, center().y + REWARD_SUBTITLE_Y_OFFSET),
      anchor('center'),
    ])

    getCardRewardDefinitions(currentState).forEach((definition, index) => {
      const x = center().x - REWARD_CARD_GAP + index * REWARD_CARD_GAP
      const y = center().y + REWARD_CARD_Y_OFFSET

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
      x: center().x,
      y: center().y + REWARD_SKIP_BUTTON_Y_OFFSET,
    })
  }
})
