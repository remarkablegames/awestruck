import { SOUND } from '../constants'

const UI_TICK_COOLDOWN = 0.12 // seconds

export function createTickPlayer(cooldown = UI_TICK_COOLDOWN) {
  let lastTickAt = -cooldown

  return function playTick() {
    const now = time()

    if (now - lastTickAt < cooldown) {
      return
    }

    play(SOUND.TICK)
    lastTickAt = now
  }
}
