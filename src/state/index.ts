import type { RunConfig } from '../config'
import { StateManager } from './manager'

let stateManager = new StateManager()

export function getStateManager() {
  return stateManager
}

export function resetStateManager(runConfig?: RunConfig) {
  stateManager = new StateManager(undefined, runConfig)
  return stateManager
}
