import { describe, it, expect } from 'vitest'
import BoardCell from './BoardCell.ts'

const ROW = 1
const COLUMN = 2
const REGION = 3
const IS_QUEEN = false

describe('BoardCell', () => {
  describe('initialization', () => {
    it(`should set position to [${ROW}, ${COLUMN}] and region to ${REGION}`, () => {
      const cell = new BoardCell(ROW, COLUMN, REGION, IS_QUEEN)

      expect(cell.getPosition()).toStrictEqual([ROW, COLUMN])
      expect(cell.getRegion()).toBe(REGION)
    })

    it(`should initialize queen status as ${IS_QUEEN} and found status as false`, () => {
      const cell = new BoardCell(ROW, COLUMN, REGION, IS_QUEEN)

      expect(cell.isQueen()).toBe(IS_QUEEN)
      expect(cell.isFound()).toBe(false)
    })
  })

  describe('interaction', () => {
    it('should change status to "note" after toggling once', () => {
      const cell = new BoardCell(ROW, COLUMN, REGION, IS_QUEEN)

      cell.toggleNote()

      expect(cell.status).toBe('note')
    })

    it('should toggle back to "empty" after toggling twice', () => {
      const cell = new BoardCell(ROW, COLUMN, REGION, IS_QUEEN)

      cell.toggleNote()
      cell.toggleNote()

      expect(cell.status).toBe('empty')
    })

    it('should mark the cell as "wrong" when marking but no queen exists', () => {
      const cell = new BoardCell(ROW, COLUMN, REGION, false)

      expect(cell.markQueen()).toBe(false)
      expect(cell.status).toBe('wrong')
    })

    it('should mark the cell as "found" when the cell contains a queen', () => {
      const cell = new BoardCell(ROW, COLUMN, REGION, true)

      expect(cell.markQueen()).toBe(true)
      expect(cell.status).toBe('found')
    })
  })
})
