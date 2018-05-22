describe("generic", () => {
  it("should stream in 0, 1, 2", () => {
    cy.clock()
    cy.visit("http://localhost:4321/generic")
    cy.contains("Wait...")
    cy.contains("Wait longer...")
    cy.tick(500)
    cy.contains("Hello")
    cy.tick(2500)
    cy
      .get('[style="padding: 2rem;"] > :nth-child(1) > :nth-child(3)')
      .contains("Hello")
  })
})
