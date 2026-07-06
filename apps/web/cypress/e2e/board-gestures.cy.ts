type BoardPosition = readonly [row: number, column: number]

const LEVEL_ONE = {
  noteCell: [0, 1],
  queenCell: [1, 3],
  dragStartCell: [1, 0],
  dragEnterCell: [1, 1],
} satisfies Record<string, BoardPosition>

const visitGame = () => {
  cy.viewport(1280, 900)
  cy.visit('/', {
    onBeforeLoad(win) {
      win.__QUEENER_E2E_SKIP_PRELOAD__ = true
      cy.stub(win.Math, 'random').returns(0)
    },
  })
  cy.get('button[aria-label="Start level"]').click()
  cy.url().should('include', '/game')
  cy.get('[data-test="game-board"]').should('be.visible')
}

const getCell = ([row, column]: BoardPosition) => cy.get(`[data-test="cell-${row}-${column}"]`)

describe('desktop board interactions', () => {
  it('uses the queen hint when pressing Q', () => {
    visitGame()

    cy.get('body').type('q')

    cy.get('.game-cell--hinted').should('exist')
    cy.get('button[aria-label="Hint used"]').should('be.disabled')
  })

  it('supports note toggling, double click, and drag note marking/removal', () => {
    visitGame()

    getCell(LEVEL_ONE.noteCell).click()
    getCell(LEVEL_ONE.noteCell).should('have.attr', 'data-status', 'note')

    getCell(LEVEL_ONE.noteCell).click()
    getCell(LEVEL_ONE.noteCell).should('have.attr', 'data-status', 'empty')

    getCell(LEVEL_ONE.queenCell).dblclick()
    getCell(LEVEL_ONE.queenCell).should('have.attr', 'data-status', 'found')

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

    getCell(LEVEL_ONE.dragStartCell).should('have.attr', 'data-status', 'note')
    getCell(LEVEL_ONE.dragEnterCell).should('have.attr', 'data-status', 'note')

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

    getCell(LEVEL_ONE.dragStartCell).should('have.attr', 'data-status', 'empty')
    getCell(LEVEL_ONE.dragEnterCell).should('have.attr', 'data-status', 'empty')
  })
})
