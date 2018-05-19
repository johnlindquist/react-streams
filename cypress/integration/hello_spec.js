describe("Hello, world!", () => {
  it("should display Hello World!", () => {
    cy.clock()
    cy.visit("http://localhost:4321/hello")
    cy.contains("Hello, world!")
  })
})
