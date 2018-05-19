describe("Assign", () => {
  beforeEach(() => {
    cy.command("launch", "assign")
    cy.get("#count > button:first").as("countButton")
    cy.get("#count > h3").as("countText")
    cy.get("#name > h3").as("nameText")
    cy.get("#countAndName > h3").as("countAndNameText")
  })

  it("should start with 5 in both 'count' and 'countAndName'", () => {
    cy.get("@countText").should("have.text", "5 apples")
    cy.get("@countAndNameText").should("have.text", "John has 5 apples")
  })

  it("should have 'John' in both 'name' and 'countAndName'", () => {
    cy.get("@nameText").should("have.text", "John")
    cy.get("@countAndNameText").should("have.text", "John has 5 apples")
  })

  it("should change both 'count' and 'countAndName' when clicking buttons", () => {
    cy.get("@countButton").click()
    cy.get("@countText").should("have.text", "6 apples")
    cy.get("@countAndNameText").should("have.text", "John has 6 apples")

    cy.get("#countAndName > button:first").click()
    cy.get("@countText").should("have.text", "7 apples")
    cy.get("@countAndNameText").should("have.text", "John has 7 apples")

    cy.get("#countAndName > button:last").click()
    cy.get("@countText").should("have.text", "6 apples")
    cy.get("@countAndNameText").should("have.text", "John has 6 apples")

    cy.get("#count > button:last").click()
    cy.get("@countText").should("have.text", "5 apples")
    cy.get("@countAndNameText").should("have.text", "John has 5 apples")
  })

  it("should change both 'name' and 'countAndName' when entering text", () => {
    cy
      .get("#name > input")
      .clear()
      .type("Mindy")
    cy.get("@nameText").should("have.text", "Mindy")
    cy.get("@countAndNameText").should("have.text", "Mindy has 5 apples")

    cy
      .get("#countAndName > input")
      .clear()
      .type("Ben")
    cy.get("@nameText").should("have.text", "Ben")
    cy.get("@countAndNameText").should("have.text", "Ben has 5 apples")
  })
})
