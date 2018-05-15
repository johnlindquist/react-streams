describe("Hello, world!", () => {
  it("should display 'Wait...' then 'Hello'", () => {
    cy.clock()
    cy.visit("http://localhost:4321/hello")
    cy.contains("Hello, world!")
  })
})
