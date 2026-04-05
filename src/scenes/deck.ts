import { SCENE, SOUND, THEME } from '../constants'
import { addBackdrop, addDeck, getBackdropPalette } from '../gameobjects'
import { getStateManager } from '../state'

const SCROLL_SPEED = 72

scene(SCENE.DECK, () => {
  const state = getStateManager().getState()
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
    onBack: () => {
      play(SOUND.BACK)
      go(SCENE.GAME)
    },
  })

  deckContent = deck.content
  maxScrollOffset = deck.maxScrollOffset
  syncDeckScroll()

  function syncDeckScroll() {
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
