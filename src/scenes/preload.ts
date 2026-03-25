import { getRunConfigFromQuery } from '../config'
import { SCENE, SOUND } from '../constants'
import { resetStateManager } from '../state'

scene(SCENE.PRELOAD, () => {
  Object.values(SOUND).forEach((sound) => {
    loadSound(sound, `sounds/${sound}.mp3`)
  })

  const runConfig = getRunConfigFromQuery()

  if (runConfig) {
    resetStateManager(runConfig)
    go(SCENE.GAME)
    return
  }

  go(SCENE.TITLE)
})
