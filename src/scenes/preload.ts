import { SCENE, SOUND } from '../constants'

scene(SCENE.PRELOAD, () => {
  Object.values(SOUND).forEach((sound) => {
    ;['ogg', 'mp3'].forEach((extension) => {
      loadSound(sound, `sounds/${sound}.${extension}`)
    })
  })

  go(SCENE.TITLE)
})
