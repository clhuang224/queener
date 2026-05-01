const LEVEL_SIZES = [5, 5, 6, 6, 7, 7, 8, 8, 9, 10]
const HIGHEST_COMPLETED_LEVEL_TO_UNLOCK_ALL = 9

const groupCellsByVisualRow = ($cells: JQuery<HTMLElement>) => {
  const rows = new Map<number, HTMLElement[]>()

  for (const cell of $cells.toArray()) {
    const top = Math.round(cell.getBoundingClientRect().top)
    const row = rows.get(top) ?? []

    row.push(cell)
    rows.set(top, row)
  }

  return Array.from(rows.values())
}

describe('board layout', () => {
  beforeEach(() => {
    cy.viewport(390, 844)
  })

  LEVEL_SIZES.forEach((size, index) => {
    const level = index + 1

    it(`renders level ${level} as a visual ${size} x ${size} board`, () => {
      cy.visit(`/game/${level}`, {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'queen-game-highest-completed-level',
            String(HIGHEST_COMPLETED_LEVEL_TO_UNLOCK_ALL),
          )
        },
      })

      cy.get('[data-test="game-board"]').should('be.visible')
      cy.get('.game-cell').should('have.length', size * size)
      cy.get('.game-cell').then(($cells) => {
        const rows = groupCellsByVisualRow($cells)

        expect(rows).to.have.length(size)
        for (const row of rows) {
          expect(row).to.have.length(size)
        }
      })
    })
  })
})
