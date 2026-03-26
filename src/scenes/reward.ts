import { getRewardDefinitions } from '../combat'
import { SCENE, SOUND, THEME } from '../constants'
import { addButton, addCard } from '../gameobjects'
import { getStateManager } from '../state'

const REWARD_CONTAINER_HEIGHT = 560
const REWARD_CONTAINER_WIDTH = 680
const REWARD_CARD_GAP = 170

const REWARD_TITLE_Y_OFFSET = -225
const REWARD_SUBTITLE_Y_OFFSET = -175
const REWARD_CARD_Y_OFFSET = 20
const REWARD_SKIP_BUTTON_Y_OFFSET = 220

scene(SCENE.REWARD, () => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))
  const stateManager = getStateManager()
  const state = stateManager.getState()

  add([rect(width(), height()), color(5, 8, 12), opacity(0.72)])

  add([
    rect(REWARD_CONTAINER_WIDTH, REWARD_CONTAINER_HEIGHT, { radius: 26 }),
    color(29, 38, 58),
    outline(4, rgb(196, 211, 246)),
    pos(center()),
    anchor('center'),
  ])

  add([
    text('Choose A Reward', {
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

  getRewardDefinitions(state).forEach((definition, index) => {
    const x = center().x - REWARD_CARD_GAP + index * REWARD_CARD_GAP
    const y = center().y + REWARD_CARD_Y_OFFSET

    addCard({
      definition,
      onClick: () => {
        play(SOUND.DROP)
        stateManager.chooseReward(definition.id)
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
      stateManager.skipReward()
      go(SCENE.GAME)
    },
    width: 180,
    x: center().x,
    y: center().y + REWARD_SKIP_BUTTON_Y_OFFSET,
  })
})
