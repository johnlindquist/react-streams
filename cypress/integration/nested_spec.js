describe("Ajax", () => {
  beforeEach(() => {
    cy.clock()
    cy.command("launch", "nested")
  })

  it("should load and display the second and third Todo", () => {
    cy.tick(1000)
    cy.contains("0")
    cy.tick(1000)
    cy.contains("1")
    cy.contains("0")
    cy.tick(1000)
    cy.contains("2")
    cy.contains("1")
  })
})
