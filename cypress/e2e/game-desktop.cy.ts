const visitGame = () => {
  cy.viewport(1280, 900)
  cy.visit('/')
  cy.contains('button', 'Start').click()
  cy.url().should('include', '/game')
  cy.get('[data-test="game-board"]').should('be.visible')
}

const getCell = (row: number, column: number) => cy.get(`[data-test="cell-${row}-${column}"]`)

describe('desktop board interactions', () => {
  it('supports single click, double click, and drag note marking', () => {
    visitGame()

    getCell(0, 1).click()
    getCell(0, 1).contains('span', 'x')

    getCell(0, 2).dblclick()
    getCell(0, 2).contains('.queen', '👸')

    getCell(1, 0).trigger('pointerdown', {
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      force: true,
    })
    getCell(1, 1).trigger('pointerenter', {
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
    getCell(1, 1).click()

    getCell(1, 0).contains('span', 'x')
    getCell(1, 1).contains('span', 'x')
  })
})
