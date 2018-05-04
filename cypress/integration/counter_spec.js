describe("Counter", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4321/counter")
  })

  it("should start with 4", () => {
    cy.get("#count").should("contain", 4)
  })

  it("should change to 6 when inc button clicked", () => {
    cy.get("#inc").click()
    cy.get("#count").should("contain", 6)
  })

  it("should change to 2 when dec button clicked", () => {
    cy.get("#dec").click()
    cy.get("#count").should("contain", 2)
  })

  it("should be 4 when inc then dec button clicked", () => {
    cy.get("#inc").click()
    cy.get("#dec").click()
    cy.get("#count").should("contain", 4)
  })
})
