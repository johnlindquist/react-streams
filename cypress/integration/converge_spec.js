describe("Converge", () => {
  beforeEach(() => {
    cy.command("launch", "converge")
  })
  it("should display 'Hello'", () => {
    cy.get("#message").should("have.text", "Hello")
  })

  it("should change to the Date when clicking date", () => {
    cy.get('[aria-label="show date message"]').click()
    const date = new Date().toLocaleDateString()
    cy.get("#message").should("have.text", date)
  })

  it("should change to 'Bye' when clicking bye", () => {
    cy.get('[aria-label="show bye message"]').click()
    cy.get("#message").should("have.text", "Bye")
  })

  it("should add a ! to the word  when clicking !!!", () => {
    cy.get('[aria-label="add exclamation point"]').click()
    cy.get("#message").contains(/.*\!$/)
  })
})
