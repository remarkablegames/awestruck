import { getRunConfigFromQuery } from '../config'
import { SCENE, SOUND } from '../constants'
import { resetStateManager } from '../state'

scene(SCENE.PRELOAD, () => {
  Object.values(SOUND).forEach((sound) => {
    ;['ogg', 'mp3'].forEach((extension) => {
      loadSound(sound, `sounds/${sound}.${extension}`)
    })
  })

  const runConfig = getRunConfigFromQuery()

  if (runConfig) {
    resetStateManager(runConfig)
    go(SCENE.GAME)
    return
  }

  go(SCENE.TITLE)
})
