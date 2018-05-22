describe("Basic", () => {
  it("should display 'Wait...' then 'Hello'", () => {
    cy.visit("http://localhost:4321/pipe")
    cy.contains("Hello, world!")
  })
})
