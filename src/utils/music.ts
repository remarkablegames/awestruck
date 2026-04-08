import { MUSIC } from '../constants'

type Play = ReturnType<typeof play>

let airwindow1 = null as Play | null
let airwindow2 = null as Play | null
let unertainty = null as Play | null

export const music = {
  get airwindow1() {
    airwindow2?.stop()
    unertainty?.stop()

    return (airwindow1 ??= play(MUSIC.AIRWINDOW1, {
      loop: true,
      volume: 0.5,
    }))
  },

  get airwindow2() {
    airwindow1?.stop()
    unertainty?.stop()

    return (airwindow2 ??= play(MUSIC.AIRWINDOW2, {
      loop: true,
      volume: 0.5,
    }))
  },

  get unertainty() {
    airwindow1?.stop()
    airwindow2?.stop()

    return (unertainty ??= play(MUSIC.UNERTAINTY, {
      loop: true,
      volume: 0.5,
    }))
  },
}
