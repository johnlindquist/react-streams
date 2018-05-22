describe("Ajax", () => {
  beforeEach(() => {
    cy.command("launch", "ajax")
  })

  it("should load and display the second and third Todo", () => {
    cy.contains("2. Sleep")
    cy.contains("3. Code")
  })
})
