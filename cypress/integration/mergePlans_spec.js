describe("mergePlans", () => {
  beforeEach(() => {
    cy.command("launch", "mergePlans")
    cy.get("input").clear()
  })
  it("should have an empty list", () => {
    cy.get("ul").should("be.empty")
  })

  it("should still be empty with 1 char", () => {
    cy.get("input").type("a")
    cy.get("ul").should("be.empty")
  })

  it("should receive results with 2 chars then clear after delete", () => {
    cy.get("input").type("ab")
    cy.get("ul").should("not.be.empty")

    cy.get("input").type("{backspace}")
    cy.get("ul").should("be.empty")
  })
})
