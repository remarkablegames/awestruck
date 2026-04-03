import kaplay from 'kaplay'

import { THEME } from './constants'

kaplay({
  background: THEME.PAGE_BACKGROUND_COLOR,
  crisp: true,
  letterbox: true,
  width: 1440,
  height: 900,
})

const { start } = await import('./scenes')

start()

// press F1
// debug.inspect = true
