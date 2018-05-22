describe("Assign", () => {
  beforeEach(() => {
    cy.command("launch", "mergeSources")
    cy.get(".count > button:first").as("countButton")
    cy.get(".count > h3").as("countText")
    cy.get(".name > h3").as("nameText")
    cy.get(".nameAndCount > h3").as("nameAndCountText")
  })

  it("should start with 5 in both 'count' and 'nameAndCount'", () => {
    cy.get("@countText").should("have.text", "5 apples")
    cy.get("@nameAndCountText").should("have.text", "John has 5 apples")
  })

  it("should have 'John' in both 'name' and 'nameAndCount'", () => {
    cy.get("@nameText").should("have.text", "John")
    cy.get("@nameAndCountText").should("have.text", "John has 5 apples")
  })

  it("should change both 'count' and 'nameAndCount' when clicking buttons", () => {
    cy.get("@countButton").click()
    cy.get("@countText").should("have.text", "6 apples")
    cy.get("@nameAndCountText").should("have.text", "John has 6 apples")

    cy.get(".nameAndCount > button:first").click()
    cy.get("@countText").should("have.text", "7 apples")
    cy.get("@nameAndCountText").should("have.text", "John has 7 apples")

    cy.get(".nameAndCount > button:last").click()
    cy.get("@countText").should("have.text", "6 apples")
    cy.get("@nameAndCountText").should("have.text", "John has 6 apples")

    cy.get(".count > button:last").click()
    cy.get("@countText").should("have.text", "5 apples")
    cy.get("@nameAndCountText").should("have.text", "John has 5 apples")
  })

  it("should change both 'name' and 'nameAndCount' when entering text", () => {
    cy
      .get(".name > input")
      .clear()
      .type("Mindy")
    cy.get("@nameText").should("have.text", "Mindy")
    cy.get("@nameAndCountText").should("have.text", "Mindy has 5 apples")

    cy
      .get(".nameAndCount > input")
      .first()
      .clear()
      .type("Ben")
    cy.get("@nameText").should("have.text", "Ben")
    cy.get("@nameAndCountText").should("have.text", "Ben has 5 apples")
  })
})
