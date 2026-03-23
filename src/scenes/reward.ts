import { chooseReward, getRewardDefinitions } from '../combat'
import { SCENE, SOUND, THEME } from '../constants'
import { addReward } from '../gameobjects'
import type { CombatState } from '../types'

scene(SCENE.REWARD, (state: CombatState) => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))

  add([rect(width(), height()), color(5, 8, 12), opacity(0.72), pos(0, 0)])

  add([
    rect(680, 400, { radius: 26 }),
    color(29, 38, 58),
    outline(4, rgb(196, 211, 246)),
    pos(width() / 2, height() / 2),
    anchor('center'),
  ])

  add([
    text('Choose A Reward', {
      align: 'center',
      size: 38,
      width: 560,
    }),
    color(248, 232, 181),
    pos(width() / 2, height() / 2 - 112),
    anchor('center'),
  ])

  add([
    text('Pick one new card before entering the next Archivist floor.', {
      align: 'center',
      size: 20,
      width: 560,
    }),
    color(222, 229, 248),
    pos(width() / 2, height() / 2 - 56),
    anchor('center'),
  ])

  getRewardDefinitions(state).forEach((definition, index) => {
    const x = width() / 2 - 196 + index * 196
    const y = height() / 2 + 92

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
})
