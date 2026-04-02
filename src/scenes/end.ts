import { FLOORS, SCENE, SOUND, THEME } from '../constants'
import { addBackdrop, addButton } from '../gameobjects'
import { resetStateManager } from '../state'

type EndStatus = 'lost' | 'won'

scene(SCENE.END, (status: EndStatus) => {
  setBackground(rgb(...THEME.GAME_BACKGROUND_COLOR))

  const title = status === 'won' ? 'Run Complete' : 'Run Lost'
  const subtitle =
    status === 'won'
      ? `You cleared all ${String(FLOORS.MAX_FLOOR)} floors and preserved the lexicon.`
      : 'The enemy won this run. Start again and tune the deck.'

  addBackdrop({
    actionAreaTop: height() * 0.48,
    overlayOpacity: 0.08,
  })

  add([rect(width(), height()), color(5, 8, 12), opacity(0.62)])

  add([
    rect(680, 400, { radius: 26 }),
    color(29, 38, 58),
    outline(4, rgb(196, 211, 246)),
    pos(width() / 2, height() / 2),
    anchor('center'),
  ])

  add([
    text(title, {
      align: 'center',
      size: 38,
      width: 560,
    }),
    color(248, 232, 181),
    pos(width() / 2, height() / 2 - 112),
    anchor('center'),
  ])

  add([
    text(subtitle, {
      align: 'center',
      size: 20,
      width: 560,
    }),
    color(222, 229, 248),
    pos(width() / 2, height() / 2 - 56),
    anchor('center'),
  ])

  addButton({
    fillColor: [92, 130, 208],
    height: 58,
    label: 'Restart Run',
    onClick: () => {
      play(SOUND.CLICK)
      resetStateManager()
      go(SCENE.GAME)
    },
    width: 196,
    x: width() / 2 - 112,
    y: height() / 2 + 104,
  })

  addButton({
    fillColor: [124, 106, 164],
    height: 58,
    label: 'Back To Title',
    onClick: () => {
      play(SOUND.CLICK)
      go(SCENE.TITLE)
    },
    width: 196,
    x: width() / 2 + 112,
    y: height() / 2 + 104,
  })

  onKeyPress('escape', () => {
    go(SCENE.TITLE)
  })
})
