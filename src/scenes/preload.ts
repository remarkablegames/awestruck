import { getRunConfigFromQuery } from '../config'
import { MUSIC, SCENE, SOUND, SPRITE } from '../constants'
import { resetStateManager } from '../state'

scene(SCENE.PRELOAD, () => {
  Object.values(SPRITE).forEach((sprite) => {
    loadSprite(sprite, `sprites/${sprite}.png`)
  })

  Object.values(SOUND).forEach((sound) => {
    loadSound(sound, `sounds/${sound}.mp3`)
  })

  Object.values(MUSIC).forEach((music) => {
    loadSound(music, `music/${music}.mp3`)
  })

  const runConfig = getRunConfigFromQuery()

  if (runConfig) {
    resetStateManager(runConfig)
    go(runConfig.startingRewardFloor ? SCENE.REWARD : SCENE.GAME)
    return
  }

  go(SCENE.TITLE)
})
