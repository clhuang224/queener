const visitHome = () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.__QUEENER_E2E_SKIP_PRELOAD__ = true
    },
  })
}

describe('game session routing', () => {
  it('redirects direct game route entry to home', () => {
    cy.visit('/game/1', {
      onBeforeLoad(win) {
        win.__QUEENER_E2E_SKIP_PRELOAD__ = true
      },
    })

    cy.location('pathname').should('eq', '/')
  })

  it('allows entry from the level picker but returns home after reload', () => {
    visitHome()
    cy.get('button[aria-label="Start level"]').click()
    cy.location('pathname').should('eq', '/game/1')

    cy.reload()

    cy.location('pathname').should('eq', '/')
  })

  it('rejects browser return to a game after leaving it', () => {
    visitHome()
    cy.get('button[aria-label="Start level"]').click()
    cy.location('pathname').should('eq', '/game/1')

    cy.go('back')
    cy.location('pathname').should('eq', '/')

    cy.go('forward')
    cy.location('pathname').should('eq', '/')
  })
})
