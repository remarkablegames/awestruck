import { COMBAT, SCENE, SOUND } from '../constants'
import { resetStateManager } from '../state'

function getQueryFloor(): number | null {
  const floor = new URLSearchParams(window.location.search).get('floor')

  if (!floor || !/^\d+$/.test(floor)) {
    return null
  }

  const parsedFloor = Number.parseInt(floor, 10)

  if (parsedFloor < 1 || parsedFloor > COMBAT.MAX_FLOOR) {
    return null
  }

  return parsedFloor
}

scene(SCENE.PRELOAD, () => {
  Object.values(SOUND).forEach((sound) => {
    ;['ogg', 'mp3'].forEach((extension) => {
      loadSound(sound, `sounds/${sound}.${extension}`)
    })
  })

  const queryFloor = getQueryFloor()

  if (queryFloor) {
    resetStateManager(queryFloor)
    go(SCENE.GAME)
    return
  }

  go(SCENE.TITLE)
})
