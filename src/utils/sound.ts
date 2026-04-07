import { SOUND } from '../constants'

const HOVER_COOLDOWN = 0.12 // seconds

export function createHoverPlayer(cooldown = HOVER_COOLDOWN) {
  let lastHoverAt = -cooldown

  return function playHover() {
    const now = time()

    if (now - lastHoverAt < cooldown) {
      return
    }

    play(SOUND.HOVER)
    lastHoverAt = now
  }
}
