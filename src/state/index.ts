import {
  cancelBuilder,
  chooseReward,
  commitChainCard,
  confirmBuilder,
  createInitialState,
  endTurn,
  skipReward,
} from '../combat'
import { DATA, SCENE } from '../constants'
import type { CombatState } from '../types'

export type StateScene =
  | typeof SCENE.END
  | typeof SCENE.GAME
  | typeof SCENE.REWARD

export type EndStatus = 'lost' | 'won'

export interface StateSnapshot {
  endStatus?: EndStatus
  scene: StateScene
  state: CombatState
}

export type StateListener = (snapshot: StateSnapshot) => void

class StateManager {
  private listeners = new Set<StateListener>()
  private state: CombatState

  constructor(state?: CombatState) {
    if (state) {
      this.state = state
      this.persistProgress()
      return
    }

    const bestFloor = getData<number>(DATA.BEST_FLOOR, 0) ?? 0
    this.state = createInitialState(bestFloor)
    this.persistProgress()
  }

  reset(): StateManager {
    stateManager = new StateManager()
    return stateManager
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
    this.runAction(() => {
      commitChainCard(this.state, instanceId)
    })
  }

  cancelBuilder(): void {
    this.runAction(() => {
      cancelBuilder(this.state)
    })
  }

  confirmBuilder(): void {
    this.runAction(() => {
      confirmBuilder(this.state)
    })
  }

  endTurn(): void {
    this.runAction(() => {
      endTurn(this.state)
    })
  }

  chooseReward(cardId: string): void {
    this.runAction(() => {
      chooseReward(this.state, cardId)
    })
  }

  skipReward(): void {
    this.runAction(() => {
      skipReward(this.state)
    })
  }

  private runAction(action: () => void): void {
    action()
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

export let stateManager = new StateManager()
