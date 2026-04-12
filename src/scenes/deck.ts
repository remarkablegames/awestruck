import { getCardDefinition } from '../combat'
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
  let selectedRemoveCardInstanceId: string | null = null

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
    cards: state.deckList,
    confirmLabel: isDeckModeRemove ? 'Confirm Remove' : undefined,
    helperText: isDeckModeRemove
      ? 'Scroll, select card, & confirm removal'
      : undefined,
    hideScrollHint: isDeckModeRemove,
    onBack: () => {
      play(SOUND.DROP)
      go(isDeckModeRemove || isRewardPhase ? SCENE.REWARD : SCENE.GAME)
    },
    onClick: isDeckModeRemove
      ? (card) => {
          selectedRemoveCardInstanceId = card.instanceId
          deck.setSelectedCard(
            selectedRemoveCardInstanceId,
            getCardDefinition(card.cardId).label,
          )
        }
      : undefined,
    onConfirm: isDeckModeRemove
      ? (instanceId) => {
          play(SOUND.DROP)
          stateManager.chooseRemoveReward(instanceId)
          go(stateManager.getSnapshot().scene)
        }
      : undefined,
    selectedCardInstanceId: selectedRemoveCardInstanceId,
    selectedCardLabel: getSelectedCardLabel(),
    title: isDeckModeRemove ? 'REMOVE 1 CARD' : 'DECK',
  })

  deckContent = deck.content
  maxScrollOffset = deck.maxScrollOffset
  syncDeckScroll()

  function getSelectedCardLabel() {
    if (!selectedRemoveCardInstanceId) {
      return undefined
    }

    const selectedCard = state.deckList.find(
      (card) => card.instanceId === selectedRemoveCardInstanceId,
    )

    return selectedCard
      ? getCardDefinition(selectedCard.cardId).label
      : undefined
  }

  function syncDeckScroll() {
    deckScrollOffset = Math.max(0, Math.min(deckScrollOffset, maxScrollOffset))

    if (deckContent) {
      deckContent.pos.y = -deckScrollOffset
    }
  }

  const playSelect = sound.createPlayer(SOUND.SELECT, 0.2)

  background.onScroll((delta) => {
    const direction = delta.y === 0 ? delta.x : delta.y

    if (!direction) {
      return
    }

    deckScrollOffset += direction > 0 ? SCROLL_SPEED : -SCROLL_SPEED
    syncDeckScroll()
    playSelect()
  })
})
