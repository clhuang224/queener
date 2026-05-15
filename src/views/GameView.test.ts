import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameView from './GameView.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import { installStorageMock } from '@/test/localStorage'
import { createTestingPinia } from '@/test/pinia'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { GameSoundType } from '@/modules/enums/GameSoundType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { QueenGamePublic } from '@/modules/game/QueenGame'

const push = vi.fn()
const openAlertModal = vi.fn()
const openConfirmModal = vi.fn()
const openResultModal = vi.fn()
const { playGameSound } = vi.hoisted(() => ({
  playGameSound: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
  }),
}))

vi.mock('@/modules/stores/globalModal', () => ({
  useGlobalModalStore: () => ({
    openAlertModal,
    openConfirmModal,
    openResultModal,
  }),
}))

vi.mock('@/modules/utils/playGameSound', () => ({
  playGameSound,
}))

const mountGameView = () => {
  const wrapper = mount(GameView, {
    props: {
      level: 1,
    },
    global: {
      plugins: [createTestingPinia()],
    },
  })
  const [queenRow, queenColumn] = getQueenPositions(wrapper)[0]!

  return {
    wrapper,
    queenCell: wrapper.findAll('.game-cell').find((cell) => {
      return (
        cell.attributes('data-row') === String(queenRow) &&
        cell.attributes('data-column') === String(queenColumn)
      )
    })!,
    restartButton: wrapper.findAll('button').find((button) => button.text() === 'Restart')!,
  }
}

const getRenderedGame = (wrapper: ReturnType<typeof mount>) => {
  return wrapper.findComponent(GameBoard).props('game') as QueenGamePublic
}

const getQueenPositions = (wrapper: ReturnType<typeof mount>) => {
  return getRenderedGame(wrapper)
    .board.flat()
    .filter((cell) => cell.isQueen())
    .map((cell) => cell.getPosition())
}

const getWrongPositions = (wrapper: ReturnType<typeof mount>) => {
  return getRenderedGame(wrapper)
    .board.flat()
    .filter((cell) => !cell.isQueen())
    .map((cell) => cell.getPosition())
}

const findCell = (wrapper: ReturnType<typeof mount>, row: number, column: number) => {
  return wrapper
    .findAll('.game-cell')
    .find(
      (cell) =>
        cell.attributes('data-row') === String(row) &&
        cell.attributes('data-column') === String(column),
    )
}

const createDeferred = () => {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('GameView', () => {
  beforeEach(() => {
    installStorageMock()
    push.mockReset()
    openAlertModal.mockReset()
    openConfirmModal.mockReset()
    openResultModal.mockReset()
    playGameSound.mockReset()
    playGameSound.mockResolvedValue(undefined)
  })

  it('restarts the current level after confirmation', async () => {
    openConfirmModal.mockResolvedValue(undefined)

    const { wrapper, queenCell, restartButton } = mountGameView()

    await queenCell.trigger('dblclick')
    expect(queenCell.attributes('data-status')).toBe('found')

    await restartButton!.trigger('click')
    await wrapper.vm.$nextTick()

    expect(openConfirmModal).toHaveBeenCalledWith({
      title: 'Restart Level',
      content: 'Are you sure you want to restart this puzzle?',
    })
    expect(queenCell.attributes('data-status')).toBe('empty')
  })

  it('keeps current progress when restart is cancelled', async () => {
    openConfirmModal.mockRejectedValue(new Error('cancelled'))

    const { wrapper, queenCell, restartButton } = mountGameView()

    await queenCell.trigger('dblclick')
    expect(queenCell.attributes('data-status')).toBe('found')

    await restartButton!.trigger('click')
    await wrapper.vm.$nextTick()

    expect(queenCell.attributes('data-status')).toBe('found')
  })

  it('uses the saved skin settings for the board', async () => {
    window.localStorage.setItem('queen-game-board-skin', BoardSkinType.LAKE)
    window.localStorage.setItem('queen-game-board-texture-enabled', 'true')
    window.localStorage.setItem('queen-game-queen-skin', QueenSkinType.PINK_CROWN)

    const { wrapper, queenCell } = mountGameView()
    const board = wrapper.find('[data-test="game-board"]')

    expect(board.attributes('style')).toContain(
      `--cell-color-0: ${BOARD_SKINS[BoardSkinType.LAKE][0]}`,
    )
    expect(wrapper.find('.game-cell').classes().length).toBeGreaterThan(1)

    await queenCell.trigger('dblclick')
    expect(queenCell.find('.queen-icon.found').attributes('src')).toBe(
      QUEEN_SKINS[QueenSkinType.PINK_CROWN].icon,
    )
  })

  it('shows win result actions and navigates to next level', async () => {
    openResultModal.mockResolvedValue('next')

    const { wrapper } = mountGameView()

    for (const [row, column] of getQueenPositions(wrapper)) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.WIN)
    expect(openResultModal).toHaveBeenCalledWith({
      title: 'Congratulations!',
      content: 'You solved the puzzle. What would you like to do next?',
      actions: [
        { label: 'Next Level', payload: 'next' },
        { label: 'Play Again', payload: 'retry' },
        { label: 'Home', payload: 'home' },
      ],
    })

    expect(push).toHaveBeenCalledWith({
      name: 'game',
      params: {
        level: '2',
      },
    })
  })

  it('waits for the win sound before showing the result modal', async () => {
    const sound = createDeferred()
    playGameSound.mockImplementation((soundName) => {
      return soundName === GameSoundType.WIN ? sound.promise : Promise.resolve()
    })

    const { wrapper } = mountGameView()

    for (const [row, column] of getQueenPositions(wrapper)) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.WIN)
    expect(wrapper.find('[data-test="result-lock-overlay"]').exists()).toBe(true)
    expect(openResultModal).not.toHaveBeenCalled()

    sound.resolve()
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(openResultModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Congratulations!',
      }),
    )
    expect(wrapper.find('[data-test="result-lock-overlay"]').exists()).toBe(false)
  })

  it('loads the next puzzle when the route level changes', async () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '1')

    const { wrapper } = mountGameView()

    await wrapper.setProps({ level: 2 })
    const [row, column] = getQueenPositions(wrapper)[0]!
    await findCell(wrapper, row, column)!.trigger('dblclick')

    expect(wrapper.find('.level-title').text()).toBe('Level 2')
    expect(findCell(wrapper, row, column)!.attributes('data-status')).toBe('found')
  })

  it('shows loss result actions and allows replay', async () => {
    openResultModal.mockResolvedValue('retry')

    const { wrapper } = mountGameView()
    const wrongPositions = getWrongPositions(wrapper).slice(0, 2)
    const wrongCell = findCell(wrapper, ...wrongPositions[0]!)!

    for (const [row, column] of wrongPositions) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.LOSE)
    expect(openResultModal).toHaveBeenCalledWith({
      title: 'Game Over',
      content: 'Out of hearts. What would you like to do?',
      actions: [
        { label: 'Play Again', payload: 'retry' },
        { label: 'Home', payload: 'home' },
      ],
    })
    expect(wrongCell.text()).toBe('')
  })
})
