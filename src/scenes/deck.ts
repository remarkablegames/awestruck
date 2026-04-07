import { SCENE, SOUND, THEME } from '../constants'
import { addBackdrop, addDeck, getBackdropPalette } from '../gameobjects'
import { getStateManager } from '../state'
import { sound } from '../utils'

const SCROLL_SPEED = 72

scene(SCENE.DECK, (mode: 'view' | 'remove' = 'view') => {
  const stateManager = getStateManager()
  const state = stateManager.getState()
  const isRewardPhase = state.status === 'reward'
  const isDeckModeRemove = mode === 'remove'

  let deckScrollOffset = 0
  let deckContent: ReturnType<typeof addDeck>['content'] | null = null
  let maxScrollOffset = 0

  setBackground(...getBackdropPalette(state.floor).gameBackgroundColor)

  addBackdrop({
    actionAreaTop: height() * 0.42,
    floor: state.floor,
    overlayOpacity: 0.06,
  })

  const background = add([
    rect(width(), height()),
    color(THEME.GAME_BACKGROUND_COLOR),
    opacity(0.42),
  ])

  const deck = addDeck({
    title: isDeckModeRemove ? 'REMOVE 1 CARD' : 'DECK',
    helperText: isDeckModeRemove
      ? 'Click a card to remove it permanently'
      : undefined,
    onClick: isDeckModeRemove
      ? (card) => {
          play(SOUND.DROP)
          stateManager.chooseRemoveReward(card.instanceId)
          go(stateManager.getSnapshot().scene)
        }
      : undefined,
    cards: state.deckList,
    onBack: () => {
      play(SOUND.BACK)
      go(isDeckModeRemove || isRewardPhase ? SCENE.REWARD : SCENE.GAME)
    },
  })

  const playTick = sound.createTickPlayer()
  deckContent = deck.content
  maxScrollOffset = deck.maxScrollOffset
  syncDeckScroll()

  function syncDeckScroll() {
    playTick()
    deckScrollOffset = Math.max(0, Math.min(deckScrollOffset, maxScrollOffset))

    if (deckContent) {
      deckContent.pos.y = -deckScrollOffset
    }
  }

  background.onScroll((delta) => {
    const direction = delta.y === 0 ? delta.x : delta.y

    if (!direction) {
      return
    }

    deckScrollOffset += direction > 0 ? SCROLL_SPEED : -SCROLL_SPEED
    syncDeckScroll()
  })
})
