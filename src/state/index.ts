import {
  cancelBuilder,
  chooseReward,
  commitChainCard,
  confirmBuilder,
  createInitialState,
  endTurn,
  skipReward,
} from '../combat'
import type { RunConfig } from '../config'
import { getDefaultRunConfig } from '../config'
import { DATA, SCENE } from '../constants'
import type { CombatState } from '../types'

type StateScene = typeof SCENE.END | typeof SCENE.GAME | typeof SCENE.REWARD

type EndStatus = 'lost' | 'won'
type StateAction<TArgs extends unknown[] = []> = (
  state: CombatState,
  ...args: TArgs
) => void

interface StateSnapshot {
  endStatus?: EndStatus
  scene: StateScene
  state: CombatState
}

type StateListener = (snapshot: StateSnapshot) => void

class StateManager {
  private listeners = new Set<StateListener>()
  private state: CombatState

  constructor(state?: CombatState, runConfig?: RunConfig) {
    if (state) {
      this.state = state
      this.persistProgress()
      return
    }

    const bestFloor = getData<number>(DATA.BEST_FLOOR, 0) ?? 0
    this.state = createInitialState(
      bestFloor,
      runConfig ?? getDefaultRunConfig(),
    )
    this.persistProgress()
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot(): StateSnapshot {
    return {
      endStatus:
        this.state.status === 'lost' || this.state.status === 'won'
          ? this.state.status
          : undefined,
      scene: this.getScene(),
      state: this.state,
    }
  }

  getState(): CombatState {
    return this.state
  }

  commitChainCard(instanceId: string): void {
    this.runAction(commitChainCard, instanceId)
  }

  cancelBuilder(): void {
    this.runAction(cancelBuilder)
  }

  confirmBuilder(): void {
    this.runAction(confirmBuilder)
  }

  endTurn(): void {
    this.runAction(endTurn)
  }

  chooseReward(cardId: string): void {
    this.runAction(chooseReward, cardId)
  }

  skipReward(): void {
    this.runAction(skipReward)
  }

  private runAction<TArgs extends unknown[]>(
    action: StateAction<TArgs>,
    ...args: TArgs
  ): void {
    action(this.state, ...args)
    this.persistProgress()
    this.notify()
  }

  private notify(): void {
    const snapshot = this.getSnapshot()

    this.listeners.forEach((listener) => {
      listener(snapshot)
    })
  }

  private persistProgress(): void {
    const savedBestFloor = getData<number>(DATA.BEST_FLOOR, 0) ?? 0

    if (this.state.bestFloor > savedBestFloor) {
      setData(DATA.BEST_FLOOR, this.state.bestFloor)
    }
  }

  private getScene(): StateScene {
    switch (this.state.status) {
      case 'reward':
        return SCENE.REWARD
      case 'won':
      case 'lost':
        return SCENE.END
      case 'playerTurn':
        return SCENE.GAME
    }
  }
}

let stateManager = new StateManager()

export function getStateManager(): StateManager {
  return stateManager
}

export function resetStateManager(runConfig?: RunConfig): StateManager {
  stateManager = new StateManager(undefined, runConfig)
  return stateManager
}
