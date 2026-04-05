import type { GameObj } from 'kaplay'

import { SCENE, SOUND, THEME } from '../constants'
import { addBackdrop, addDeck, getBackdropPalette } from '../gameobjects'
import { getStateManager } from '../state'

const SCROLL_SPEED = 72

scene(SCENE.DECK, () => {
  const state = getStateManager().getState()
  let deckScrollOffset = 0
  let deck: GameObj | null = null

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

  renderDeck()

  function renderDeck() {
    deck?.destroy()

    const { root, maxScrollOffset } = addDeck({
      cards: state.deckList,
      onBack: () => {
        play(SOUND.BACK)
        go(SCENE.GAME)
      },
      scrollOffset: deckScrollOffset,
    })

    deck = root

    deckScrollOffset = Math.min(deckScrollOffset, maxScrollOffset)
  }

  background.onScroll((delta) => {
    const direction = delta.y === 0 ? delta.x : delta.y

    if (!direction) {
      return
    }

    deckScrollOffset += direction > 0 ? SCROLL_SPEED : -SCROLL_SPEED
    deckScrollOffset = Math.max(0, deckScrollOffset)
    renderDeck()
  })
})
