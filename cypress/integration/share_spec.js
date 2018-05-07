describe("Share", () => {
  beforeEach(() => {
    cy.command("launch", "share")
    cy.wait("@get")
  })

  it("should display the same data with only 1 request", () => {
    cy.get("ul").should("have.length", 2)
    cy.get("ul > li").should("have.length", 6)
    //first group
    cy.get("ul:first > li:nth-child(1)").should("have.text", "Eat")
    cy.get("ul:first > li:nth-child(2)").should("have.text", "Sleep")
    cy.get("ul:first > li:nth-child(3)").should("have.text", "Code")
    //second group
    cy.get("ul:last > li:nth-child(1)").should("have.text", "Eat")
    cy.get("ul:last > li:nth-child(2)").should("have.text", "Sleep")
    cy.get("ul:last > li:nth-child(3)").should("have.text", "Code")
  })
})
