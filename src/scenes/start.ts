import './deck'
import './end'
import './game'
import './preload'
import './reward'
import './title'

import { SCENE } from '../constants'

export function start() {
  go(SCENE.PRELOAD)
}
