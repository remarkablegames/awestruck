import kaplay from 'kaplay'

kaplay({
  width: 1440,
  height: 900,
  letterbox: true,
})

const { start } = await import('./scenes')

start()

// press F1
// debug.inspect = true
