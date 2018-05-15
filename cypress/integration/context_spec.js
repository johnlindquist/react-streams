describe("Context", () => {
  beforeEach(() => {
    cy.command("launch", "context")
  })
  it("should display 'Hello'", () => {
    cy.get("#message").should("have.text", "Hello")
  })

  it("should change to 'Bye' when clicking bye", () => {
    cy.get('[aria-label="show bye message"]').click()
    cy.get("#message").should("have.text", "Bye")
  })

  it("should change to the 'Yo' when clicking yo", () => {
    cy.get('[aria-label="show yo message"]').click()
    cy.get("#message").should("have.text", "Yo")
  })
})
