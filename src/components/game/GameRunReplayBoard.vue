<script setup lang="ts">
import { computed, onScopeDispose, ref, watch } from 'vue'
import QueenIcon from '@/components/common/QueenIcon.vue'
import BoardCell from '@/modules/game/BoardCell'
import QueenGameRunReplay from '@/modules/game/QueenGameRunReplay'
import { createPuzzleVariantFromMetadata } from '@/modules/game/puzzleVariant'
import { BOARD_SKINS } from '@/modules/constants/boardSkins'
import { CELL_TEXTURES } from '@/modules/constants/cellTextures'
import { QUEEN_SKINS } from '@/modules/constants/queenSkins'
import { ActionType } from '@/modules/enums/ActionType'
import { BoardSkinType } from '@/modules/enums/BoardSkinType'
import { QueenSkinType } from '@/modules/enums/QueenSkinType'
import type { BoardSkinType as BoardSkin } from '@/modules/enums/BoardSkinType'
import type { QueenSkinType as QueenSkin } from '@/modules/enums/QueenSkinType'
import type { Puzzle, PuzzleVariantMetadata } from '@/modules/types/puzzle'
import type { RunActionRecord } from '@/modules/types/run'
import { pickDistributedColors } from '@/modules/utils/pickDistributedColors'
import { pickRandomItems } from '@/modules/utils/pickRandomItems'

const PLAYBACK_INTERVAL_MS = 33
const CELL_SIZE_PX = 62

const props = withDefaults(
  defineProps<{
    puzzle: Puzzle
    puzzleVariantMetadata: PuzzleVariantMetadata
    records: RunActionRecord[]
    queenSkin?: QueenSkin
    boardSkin?: BoardSkin
    boardTextureEnabled?: boolean
    speed?: number
    scale?: number
  }>(),
  {
    queenSkin: QueenSkinType.PINK_CROWN,
    boardSkin: BoardSkinType.LAKE,
    boardTextureEnabled: false,
    speed: 2,
    scale: 0.5,
  },
)

const board = ref<BoardCell[][]>([])
const replay = ref(new QueenGameRunReplay([]))

let playbackStartedAt = 0
let playbackTimer: ReturnType<typeof setInterval> | null = null

const boardSize = computed(() => props.puzzle.rules.size)
const queenIcon = computed(() => QUEEN_SKINS[props.queenSkin].icon)
const queenNoteIcon = computed(() => QUEEN_SKINS[props.queenSkin].noteIcon)
const boardTextureTypes = computed(() => {
  return props.boardTextureEnabled ? pickRandomItems(CELL_TEXTURES, boardSize.value) : []
})
const boardStyle = computed(() => ({
  '--board-size': String(boardSize.value),
  '--replay-board-size': `${boardSize.value * CELL_SIZE_PX * props.scale}px`,
  ...Object.fromEntries(
    pickDistributedColors(BOARD_SKINS[props.boardSkin], boardSize.value).map((color, index) => [
      `--cell-color-${index}`,
      color,
    ]),
  ),
}))

const createReplayBoard = () => {
  const puzzleVariant = createPuzzleVariantFromMetadata(props.puzzle, props.puzzleVariantMetadata).puzzle
  const queenSet = new Set(
    puzzleVariant.queens.map(([row, column]) => row * puzzleVariant.rules.size + column),
  )

  board.value = puzzleVariant.regions.map((row, rowIndex) =>
    row.map(
      (region, columnIndex) =>
        new BoardCell(
          rowIndex,
          columnIndex,
          region,
          queenSet.has(rowIndex * puzzleVariant.rules.size + columnIndex),
        ),
    ),
  )
}

const getCellTextureClass = (region: number) => {
  return boardTextureTypes.value[region] ?? ''
}

const getCellColor = (region: number) => `var(--cell-color-${region})`

const stopPlayback = () => {
  if (playbackTimer === null) return

  clearInterval(playbackTimer)
  playbackTimer = null
}

const applyRecord = (record: RunActionRecord) => {
  const [row, column] = record.position
  const cell = board.value[row]?.[column]
  if (!cell) return

  if (record.action === ActionType.MARK_NOTE) {
    cell.markNote()
  } else if (record.action === ActionType.REMOVE_NOTE) {
    cell.removeNote()
  } else {
    cell.markQueen()
  }
}

const tickPlayback = () => {
  const elapsedMs = (Date.now() - playbackStartedAt) * props.speed
  for (const record of replay.value.getNextActions(elapsedMs)) {
    applyRecord(record)
  }

  if (replay.value.isFinished()) {
    stopPlayback()
  }
}

const startPlayback = () => {
  stopPlayback()
  createReplayBoard()
  replay.value = new QueenGameRunReplay(props.records)
  playbackStartedAt = Date.now()
  tickPlayback()
  playbackTimer = setInterval(tickPlayback, PLAYBACK_INTERVAL_MS)
}

watch(
  () => [props.puzzle, props.puzzleVariantMetadata, props.records, props.speed],
  startPlayback,
  { immediate: true },
)

onScopeDispose(stopPlayback)
</script>

<template>
  <div class="game-run-replay-board" :style="boardStyle">
    <div class="replay-cells" data-test="replay-board">
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <div
          v-for="cell in row"
          :key="cell.getPosition().join('-')"
          class="replay-cell"
          :class="getCellTextureClass(cell.getRegion())"
          :style="{ backgroundColor: getCellColor(cell.getRegion()) }"
          :data-test="`replay-cell-${cell.row}-${cell.column}`"
          :data-status="cell.status"
        >
          <QueenIcon
            v-if="cell.isQueen() && cell.status === 'found'"
            status="found"
            :icon="queenIcon"
            :note-icon="queenNoteIcon"
          />
          <QueenIcon
            v-if="cell.status === 'note'"
            status="note"
            :icon="queenIcon"
            :note-icon="queenNoteIcon"
          />
          <QueenIcon
            v-if="cell.status === 'wrong'"
            status="wrong"
            :icon="queenIcon"
            :note-icon="queenNoteIcon"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/texture.module.scss';

.game-run-replay-board {
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: none;
  user-select: none;
}

.replay-cells {
  --board-gap: 4px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--board-gap);
  width: var(--replay-board-size);
}

.replay-cell {
  flex: 0 0 calc((100% - (var(--board-size) - 1) * var(--board-gap)) / var(--board-size));
  box-sizing: border-box;
  min-width: 0;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-cell);
}
</style>
