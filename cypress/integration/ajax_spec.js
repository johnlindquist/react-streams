describe("Ajax", () => {
  beforeEach(() => {
    cy.command("launch", "ajax")
  })

  it("should load and display the first Todo", () => {
    cy.contains("1. Eat")
  })
})
