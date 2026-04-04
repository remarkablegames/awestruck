import type { GameObj } from 'kaplay'

interface MessageOptions {
  message: string
  width: number
  x: number
  y: number
}

export function addMessage({ message, width, x, y }: MessageOptions): {
  root: GameObj
} {
  const root = add([
    text(message, {
      size: 22,
      width,
    }),
    color(218, 226, 246),
    pos(x, y),
  ])

  return { root }
}
