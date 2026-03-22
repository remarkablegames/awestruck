import './game'
import './preload'
import './title'

import { SCENE } from '../constants'

export function start() {
  go(SCENE.PRELOAD)
}
