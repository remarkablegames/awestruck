import { SCENE, SOUND } from '../constants'

scene(SCENE.PRELOAD, () => {
  Object.values(SOUND).forEach((sound) => {
    ;['mp3', 'ogg'].forEach((extension) => {
      loadSound(sound, `sounds/${sound}.${extension}`)
    })
  })

  go(SCENE.TITLE)
})
