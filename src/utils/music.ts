import { SOUND } from '../constants'

let playMusic: ReturnType<typeof play> | null = null

export function startMusic() {
  playMusic ??= play(SOUND.MUSIC, {
    loop: true,
    volume: 0.5,
  })
}

export function stopMusic() {
  playMusic?.stop()
  playMusic = null
}
