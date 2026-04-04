const x = 40

export const POSITION = {
  MESSAGE: {
    x,
    get y() {
      return height() - 42
    },
  },

  STATUS: { x, y: 28 },
}
