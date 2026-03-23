import { chooseReward, getRewardDefinitions, skipReward } from '../combat'
import { SCENE, SOUND, THEME } from '../constants'
import { addButton, addReward } from '../gameobjects'
import type { CombatState } from '../types'

scene(SCENE.REWARD, (state: CombatState) => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))

  add([rect(width(), height()), color(5, 8, 12), opacity(0.72), pos(0, 0)])

  add([
    rect(680, 400, { radius: 26 }),
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
    pos(center().x, center().y - 150),
    anchor('center'),
  ])

  add([
    text('Pick one new card before entering the next Archivist floor.', {
      align: 'center',
      size: 20,
      width: 560,
    }),
    color(222, 229, 248),
    pos(center().x, center().y - 100),
    anchor('center'),
  ])

  getRewardDefinitions(state).forEach((definition, index) => {
    const x = center().x - 170 + index * 170
    const y = center().y + 60

    addReward({
      definition,
      onClick: () => {
        play(SOUND.DROP)
        chooseReward(state, definition.id)
        go(SCENE.GAME, state)
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
      skipReward(state)
      go(SCENE.GAME, state)
    },
    width: 180,
    x: center().x,
    y: center().y + 240,
  })
})
