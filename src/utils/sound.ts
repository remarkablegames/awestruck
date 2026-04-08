import { SOUND } from '../constants'
import type { Sound } from '../types'

export function createPlayer(sound: Sound, cooldown: number) {
  let lastPlayedAt = 0

  return function playSound() {
    const now = time()

    if (now - lastPlayedAt < cooldown) {
      return
    }

    lastPlayedAt = now
    play(sound)
  }
}

export const playHover = createPlayer(SOUND.HOVER, 0.12)
