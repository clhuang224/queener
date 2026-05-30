import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GameCell from './GameCell.vue'
import BoardCell from '@/modules/game/BoardCell'

const mountGameCell = (cell: BoardCell) => {
  return mount(GameCell, {
    props: {
      cell,
      cellTextureClassName: '',
      isHinted: false,
      queenIcon: '/queen.png',
      queenNoteIcon: '/note.png',
    },
  })
}

describe('GameCell', () => {
  it('labels an empty cell with row, column, region, and status', () => {
    const wrapper = mountGameCell(new BoardCell(0, 1, 2, false))

    expect(wrapper.attributes('aria-label')).toBe('Row 1, column 2, region 3, empty')
  })

  it('labels note, found, and wrong cell statuses', () => {
    const noteCell = new BoardCell(0, 0, 0, false)
    noteCell.markNote()

    const foundCell = new BoardCell(1, 0, 1, true)
    foundCell.markQueen()

    const wrongCell = new BoardCell(1, 1, 1, false)
    wrongCell.markQueen()

    expect(mountGameCell(noteCell).attributes('aria-label')).toBe(
      'Row 1, column 1, region 1, note',
    )
    expect(mountGameCell(foundCell).attributes('aria-label')).toBe(
      'Row 2, column 1, region 2, found queen',
    )
    expect(mountGameCell(wrongCell).attributes('aria-label')).toBe(
      'Row 2, column 2, region 2, wrong queen',
    )
  })
})
