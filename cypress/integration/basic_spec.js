describe("Basic", () => {
  it("should display 'Wait...' then 'Hello'", () => {
    cy.clock()
    cy.visit("http://localhost:4321/basic")
    cy.contains("Wait...")
    cy.tick(2000)
    cy.contains("Hello")
  })
})
