type BoardPosition = readonly [row: number, column: number]

const LEVEL_ONE = {
  noteCell: [0, 1],
  queenCell: [1, 3],
  dragStartCell: [1, 0],
  dragEnterCell: [1, 1],
} satisfies Record<string, BoardPosition>

const visitGame = () => {
  cy.viewport(1280, 900)
  cy.visit('/')
  cy.contains('button', 'Start').click()
  cy.url().should('include', '/game')
  cy.get('[data-test="game-board"]').should('be.visible')
}

const getCell = ([row, column]: BoardPosition) => cy.get(`[data-test="cell-${row}-${column}"]`)

describe('desktop board interactions', () => {
  it('supports single click, double click, and drag note marking', () => {
    visitGame()

    getCell(LEVEL_ONE.noteCell).click()
    getCell(LEVEL_ONE.noteCell).contains('span', 'x')

    getCell(LEVEL_ONE.queenCell).dblclick()
    getCell(LEVEL_ONE.queenCell).contains('.queen', '👸')

    getCell(LEVEL_ONE.dragStartCell).trigger('pointerdown', {
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      force: true,
    })
    getCell(LEVEL_ONE.dragEnterCell).trigger('pointerenter', {
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      force: true,
    })
    cy.get('[data-test="game-board"]').trigger('pointerup', {
      pointerType: 'mouse',
      button: 0,
      buttons: 0,
      force: true,
    })
    getCell(LEVEL_ONE.dragEnterCell).click()

    getCell(LEVEL_ONE.dragStartCell).contains('span', 'x')
    getCell(LEVEL_ONE.dragEnterCell).contains('span', 'x')
  })
})
