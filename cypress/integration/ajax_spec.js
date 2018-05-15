describe("Ajax", () => {
  beforeEach(() => {
    cy.command("launch", "ajax")
  })

  it("should load and display the third Todo", () => {
    cy.contains("3. Code")
  })
})
