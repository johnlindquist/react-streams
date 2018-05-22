describe("stream", () => {
  it("should stream in 0, 1, 2", () => {
    cy.visit("http://localhost:4321/streamProps")
    cy.contains("Hello, world!")
    cy.contains("Bonjour, John!")
  })
})
