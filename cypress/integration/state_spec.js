describe("State", () => {
  beforeEach(() => {
    cy.command("launch", "state")
  })

  it("should have a message", () => {
    cy.contains("Hello")
  })
})
