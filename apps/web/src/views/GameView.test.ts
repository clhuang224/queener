import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameView from './GameView.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import GameRunReplayBoard from '@/components/game/GameRunReplayBoard.vue'
import { installStorageMock } from '@/test/localStorage'
import { createTestingPinia } from '@/test/pinia'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import { ActionType } from '@/modules/enums/ActionType'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { GameSoundType } from '@/modules/enums/GameSoundType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import {
  END_REPLAY_ENABLED_STORAGE_KEY,
  QUEEN_HINT_SHORTCUT_STORAGE_KEY,
} from '@/modules/stores/gameplay'
import type { QueenGamePublic } from '@/modules/game/QueenGame'

const runRecorderMock = vi.hoisted(() => {
  const instances: Array<{
    markNote: ReturnType<typeof vi.fn>
    removeNote: ReturnType<typeof vi.fn>
    markQueen: ReturnType<typeof vi.fn>
    hint: ReturnType<typeof vi.fn>
    getRecords: ReturnType<typeof vi.fn>
  }> = []
  const create = vi.fn(function QueenGameRunRecorderMock() {
    const recorder = {
      markNote: vi.fn(),
      removeNote: vi.fn(),
      markQueen: vi.fn(),
      hint: vi.fn(),
      getRecords: vi.fn(() => []),
    }
    instances.push(recorder)
    return recorder
  })

  return {
    create,
    instances,
  }
})

const push = vi.fn()
const openAlertModal = vi.fn()
const openConfirmModal = vi.fn()
const openResultModal = vi.fn()
const globalModal = {
  isOpen: false,
}
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
    globalModal,
    openAlertModal,
    openConfirmModal,
    openResultModal,
  }),
}))

vi.mock('@/modules/utils/playGameSound', () => ({
  playGameSound,
}))

vi.mock('@/modules/game/QueenGameRunRecorder', () => ({
  default: runRecorderMock.create,
}))

const mountGameView = () => {
  const wrapper = mount(GameView, {
    attachTo: document.body,
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
    restartButton: wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Restart level')!,
  }
}

const mountedWrappers: ReturnType<typeof mount>[] = []

const mountTrackedGameView = () => {
  const mounted = mountGameView()
  mountedWrappers.push(mounted.wrapper)
  return mounted
}

const pressShortcutKey = (key: string, options: KeyboardEventInit = {}) => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, ...options }))
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

const getActiveRunRecorder = () => {
  return runRecorderMock.instances[runRecorderMock.instances.length - 1]!
}

const createDeferred = () => {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

const getReplayRecords = () => [
  {
    action: ActionType.MARK_QUEEN,
    actionAtMillisecond: 1000,
    position: [0, 0] as [number, number],
  },
]

const finishResultReplay = async (wrapper: ReturnType<typeof mount>) => {
  const replayBoard = wrapper.findComponent(GameRunReplayBoard)
  expect(replayBoard.exists()).toBe(true)

  replayBoard.vm.$emit('finished')
  await Promise.resolve()
  await wrapper.vm.$nextTick()
}

describe('GameView', () => {
  beforeEach(() => {
    installStorageMock()
    push.mockReset()
    openAlertModal.mockReset()
    openConfirmModal.mockReset()
    openResultModal.mockReset()
    globalModal.isOpen = false
    playGameSound.mockReset()
    playGameSound.mockResolvedValue(undefined)
    runRecorderMock.create.mockClear()
    runRecorderMock.instances.length = 0
  })

  afterEach(() => {
    mountedWrappers.splice(0).forEach((wrapper) => {
      wrapper.unmount()
    })
  })

  it('restarts the current level after confirmation', async () => {
    openConfirmModal.mockResolvedValue(undefined)

    const { wrapper, queenCell, restartButton } = mountTrackedGameView()

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

    const { wrapper, queenCell, restartButton } = mountTrackedGameView()

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

    const { wrapper, queenCell } = mountTrackedGameView()
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

  it('shows the run time timer', () => {
    const { wrapper } = mountTrackedGameView()

    expect(wrapper.find('[aria-label="Run time"]').text()).toBe('00:00.000')
  })

  it('shows win result actions and navigates to next level', async () => {
    openResultModal.mockResolvedValue('next')

    const { wrapper } = mountTrackedGameView()
    getActiveRunRecorder().getRecords.mockReturnValue(getReplayRecords())

    for (const [row, column] of getQueenPositions(wrapper)) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()

    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(true)
    expect(wrapper.findComponent(GameBoard).exists()).toBe(true)
    expect(wrapper.findComponent(GameRunReplayBoard).attributes('style')).toContain(
      '--replay-cell-opacity: 0.58',
    )
    wrapper.findComponent(GameRunReplayBoard).vm.$emit('timeUpdate', 500)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.replay-swatch').attributes('style')).toContain('--replay-translate: -25%')
    expect(wrapper.find('.replay-scale').text()).toContain('00:00.500')
    expect(wrapper.find('.replay-scale').text()).toContain('00:01.000')
    expect(wrapper.findAll('.replay-color')).toHaveLength(10)
    expect(openResultModal).not.toHaveBeenCalled()
    await finishResultReplay(wrapper)

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
    const modal = createDeferred()
    playGameSound.mockImplementation((soundName) => {
      return soundName === GameSoundType.WIN ? sound.promise : Promise.resolve()
    })
    openResultModal.mockReturnValue(modal.promise)

    const { wrapper } = mountTrackedGameView()
    getActiveRunRecorder().getRecords.mockReturnValue(getReplayRecords())

    for (const [row, column] of getQueenPositions(wrapper)) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()

    expect(wrapper.findComponent(GameRunReplayBoard).exists()).toBe(true)
    expect(openResultModal).not.toHaveBeenCalled()

    await finishResultReplay(wrapper)

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.WIN)
    expect(wrapper.find('[data-test="result-lock-overlay"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(true)
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
    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(true)

    modal.resolve()
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(false)
  })

  it('skips an active replay and opens the result modal', async () => {
    openResultModal.mockResolvedValue('home')

    const { wrapper } = mountTrackedGameView()
    getActiveRunRecorder().getRecords.mockReturnValue(getReplayRecords())

    for (const [row, column] of getQueenPositions(wrapper)) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()

    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(true)

    await wrapper.get('button[aria-label="Skip replay"]').trigger('click')
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(false)
    expect(openResultModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Congratulations!',
      }),
    )
  })

  it('skips the result replay when end replay is disabled', async () => {
    window.localStorage.setItem(END_REPLAY_ENABLED_STORAGE_KEY, 'false')
    openResultModal.mockResolvedValue('next')

    const { wrapper } = mountTrackedGameView()

    for (const [row, column] of getQueenPositions(wrapper)) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="result-replay-overlay"]').exists()).toBe(false)
    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.WIN)
    expect(openResultModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Congratulations!',
      }),
    )
    expect(push).toHaveBeenCalledWith({
      name: 'game',
      params: {
        level: '2',
      },
    })
  })

  it('loads the next puzzle when the route level changes', async () => {
    window.localStorage.setItem('queen-game-highest-completed-level', '1')

    const { wrapper } = mountTrackedGameView()

    await wrapper.setProps({ level: 2 })
    const [row, column] = getQueenPositions(wrapper)[0]!
    await findCell(wrapper, row, column)!.trigger('dblclick')

    expect(wrapper.find('.level-title').text()).toBe('Level 2')
    expect(findCell(wrapper, row, column)!.attributes('data-status')).toBe('found')
  })

  it('shows loss result actions and allows replay', async () => {
    openResultModal.mockResolvedValue('retry')

    const { wrapper } = mountTrackedGameView()
    getActiveRunRecorder().getRecords.mockReturnValue(getReplayRecords())
    const wrongPositions = getWrongPositions(wrapper).slice(0, 2)
    const wrongCell = findCell(wrapper, ...wrongPositions[0]!)!

    for (const [row, column] of wrongPositions) {
      await findCell(wrapper, row, column)!.trigger('dblclick')
    }
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(openResultModal).not.toHaveBeenCalled()
    await finishResultReplay(wrapper)

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

  it('shows a used hint state and animates the hinted cell after hint is consumed', async () => {
    openAlertModal.mockResolvedValue(undefined)

    const { wrapper } = mountTrackedGameView()
    const hintButton = wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Use hint')!

    await hintButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(openAlertModal).not.toHaveBeenCalled()
    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.HINT)
    expect(wrapper.find('.game-cell--hinted').exists()).toBe(true)
    expect(wrapper.find('.game-cell--hinted').attributes('data-status')).toBe('found')
    expect(hintButton.attributes('aria-label')).toBe('Hint used')
    expect(hintButton.attributes('disabled')).toBeDefined()
  })

  it('uses the queen hint shortcut during active play', async () => {
    const { wrapper } = mountTrackedGameView()

    pressShortcutKey('q')
    await wrapper.vm.$nextTick()

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.HINT)
    expect(wrapper.find('.game-cell--hinted').exists()).toBe(true)
    expect(wrapper.find('.game-cell--hinted').attributes('data-status')).toBe('found')
  })

  it('uses the queen hint shortcut from a focused board cell', async () => {
    const { wrapper } = mountTrackedGameView()
    const cell = wrapper.get('.game-cell')

    await cell.trigger('keydown', { key: 'q' })
    await wrapper.vm.$nextTick()

    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.HINT)
    expect(wrapper.find('.game-cell--hinted').exists()).toBe(true)
  })

  it('uses the saved queen hint shortcut', async () => {
    window.localStorage.setItem(QUEEN_HINT_SHORTCUT_STORAGE_KEY, 'h')
    const { wrapper } = mountTrackedGameView()

    pressShortcutKey('q')
    await wrapper.vm.$nextTick()
    expect(playGameSound).not.toHaveBeenCalledWith(GameSoundType.HINT)

    pressShortcutKey('h')
    await wrapper.vm.$nextTick()
    expect(playGameSound).toHaveBeenCalledWith(GameSoundType.HINT)
  })

  it('ignores modified queen hint shortcut key presses', async () => {
    const { wrapper } = mountTrackedGameView()

    pressShortcutKey('q', { ctrlKey: true })
    pressShortcutKey('q', { metaKey: true })
    pressShortcutKey('q', { shiftKey: true })
    await wrapper.vm.$nextTick()

    expect(playGameSound).not.toHaveBeenCalledWith(GameSoundType.HINT)
  })

  it('ignores the queen hint shortcut while a modal is open or an editable field is focused', async () => {
    const { wrapper } = mountTrackedGameView()
    const input = document.createElement('input')
    document.body.append(input)

    globalModal.isOpen = true
    pressShortcutKey('q')
    expect(playGameSound).not.toHaveBeenCalledWith(GameSoundType.HINT)

    globalModal.isOpen = false
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(playGameSound).not.toHaveBeenCalledWith(GameSoundType.HINT)
    input.remove()
  })

  it('records player actions during the current run', async () => {
    const { wrapper } = mountTrackedGameView()
    const recorder = getActiveRunRecorder()
    const gameBoard = wrapper.findComponent(GameBoard)

    gameBoard.vm.$emit('mark-note', [0, 1])
    gameBoard.vm.$emit('remove-note', [0, 1])
    gameBoard.vm.$emit('mark-queen', [0, 0])

    const hintButton = wrapper
      .findAll('button')
      .find((button) => button.attributes('aria-label') === 'Use hint')!
    await hintButton.trigger('click')

    expect(recorder.markNote).toHaveBeenCalledWith([0, 1])
    expect(recorder.removeNote).toHaveBeenCalledWith([0, 1])
    expect(recorder.markQueen).toHaveBeenCalledWith([0, 0])
    expect(recorder.hint).toHaveBeenCalledWith(expect.any(Array))
  })

  it('starts a fresh run recorder after restart', async () => {
    openConfirmModal.mockResolvedValue(undefined)

    const { wrapper, restartButton } = mountTrackedGameView()
    const recorderCount = runRecorderMock.instances.length

    await restartButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(runRecorderMock.instances).toHaveLength(recorderCount + 1)
  })
})
