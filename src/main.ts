import kaplay from 'kaplay'

import { THEME } from './constants'

kaplay({
  background: [...THEME.PAGE_BACKGROUND_COLOR],
  height: 900,
  letterbox: true,
  width: 1440,
})

const { start } = await import('./scenes')

start()

// press F1
// debug.inspect = true
