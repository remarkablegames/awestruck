import {
  cancelBuilder,
  chooseCardReward,
  chooseHpReward,
  chooseRelicReward,
  chooseUpgradeReward,
  commitChainCard,
  confirmBuilder,
  createInitialState,
  endTurn,
  skipCardReward,
  skipHpReward,
  skipRelicReward,
  skipUpgradeReward,
} from '../combat'
import { getDefaultRunConfig, type RunConfig } from '../config'
import { DATA, SCENE } from '../constants'
import type { Card, CombatState, HpRewardType, Relic } from '../types'

type StateScene = typeof SCENE.END | typeof SCENE.GAME | typeof SCENE.REWARD

type EndStatus = 'lost' | 'won'
type StateAction<TArgs extends unknown[] = []> = (
  state: CombatState,
  ...args: TArgs
) => void

interface StateSnapshot {
  actionResult?: StateActionResult
  endStatus?: EndStatus
  scene: StateScene
  state: CombatState
}

export interface ConfirmBuilderActionResult {
  enemyBurnApplied: number
  enemyDamage: number
  energyGained: number
  playerBlockGained: number
  playerHealGained: number
  selfDamageTaken: number
  type: 'confirmBuilder'
}

export interface EndTurnActionResult {
  playerBlockedDamage: number
  playerDamageTaken: number
  type: 'endTurn'
}

export type StateActionResult = ConfirmBuilderActionResult | EndTurnActionResult

type StateListener = (snapshot: StateSnapshot) => void

export class StateManager {
  private actionResult?: StateActionResult
  private listeners = new Set<StateListener>()
  private state: CombatState

  constructor(state?: CombatState, runConfig?: RunConfig) {
    if (state) {
      this.state = state
      this.persistProgress()
      return
    }

    const bestFloor = getData(DATA.BEST_FLOOR, 0) as number
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
      actionResult: this.actionResult,
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
    const before = {
      builderLength: this.state.builder.length,
      enemyBurn: this.state.enemy.burn,
      enemyHealth: this.state.enemy.health,
      playerBlock: this.state.player.block,
      playerEnergy: this.state.player.energy,
      playerHealth: this.state.player.health,
    }

    confirmBuilder(this.state)

    const hasBuilderResolved = Boolean(
      before.builderLength && !this.state.builder.length,
    )

    this.actionResult = hasBuilderResolved
      ? {
          enemyBurnApplied: Math.max(
            0,
            this.state.enemy.burn - before.enemyBurn,
          ),
          enemyDamage: Math.max(
            0,
            before.enemyHealth - this.state.enemy.health,
          ),
          energyGained: Math.max(
            0,
            this.state.player.energy - before.playerEnergy,
          ),
          playerBlockGained: Math.max(
            0,
            this.state.player.block - before.playerBlock,
          ),
          playerHealGained: Math.max(
            0,
            this.state.player.health - before.playerHealth,
          ),
          selfDamageTaken: Math.max(
            0,
            before.playerHealth - this.state.player.health,
          ),
          type: 'confirmBuilder',
        }
      : undefined

    this.persistProgress()
    this.notify()
  }

  endTurn(): void {
    const enemyIntent = this.state.enemy.intents[this.state.enemy.intentCursor]
    const before = {
      playerBlock: this.state.player.block,
      playerHealth: this.state.player.health,
      turn: this.state.turn,
    }

    endTurn(this.state)

    const turnResolved = this.state.turn > before.turn

    this.actionResult = turnResolved
      ? {
          playerBlockedDamage: Math.min(
            before.playerBlock,
            enemyIntent.attack ?? 0,
          ),
          playerDamageTaken: Math.max(
            0,
            before.playerHealth - this.state.player.health,
          ),
          type: 'endTurn',
        }
      : undefined

    this.persistProgress()
    this.notify()
  }

  chooseHpReward(rewardType: HpRewardType): void {
    this.runAction(chooseHpReward, rewardType)
  }

  skipHpReward(): void {
    this.runAction(skipHpReward)
  }

  chooseCardReward(cardId: Card): void {
    this.runAction(chooseCardReward, cardId)
  }

  chooseUpgradeReward(instanceId: string): void {
    this.runAction(chooseUpgradeReward, instanceId)
  }

  chooseRelicReward(relicId: Relic): void {
    this.runAction(chooseRelicReward, relicId)
  }

  skipRelicReward(): void {
    this.runAction(skipRelicReward)
  }

  skipCardReward(): void {
    this.runAction(skipCardReward)
  }

  skipUpgradeReward(): void {
    this.runAction(skipUpgradeReward)
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
    this.actionResult = undefined

    this.listeners.forEach((listener) => {
      listener(snapshot)
    })
  }

  private persistProgress(): void {
    const savedBestFloor = getData(DATA.BEST_FLOOR, 0) as number

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
