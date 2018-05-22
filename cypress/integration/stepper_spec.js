describe("Stepper", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4321/stepper")
    cy.get(":nth-child(1) > input").as("min")
    cy.get(":nth-child(2) > input").as("max")
    cy.get(":nth-child(3) > input").as("step")
    cy.get('[aria-label="Increment value"]').as("inc")
    cy.get('[aria-label="Decrement value"]').as("dec")
    cy.get('[type="text"]').as("value")
  })

  it("should increase and decrease by the step amount", () => {
    cy.get("@value").should("have.value", "10")
    cy.get("@inc").click()
    cy.get("@value").should("have.value", "11")
    cy.get("@dec").click()
    cy.get("@value").should("have.value", "10")

    cy
      .get("@step")
      .clear()
      .type("2")

    cy.get("@value").should("have.value", "10")
    cy.get("@inc").click()
    cy.get("@value").should("have.value", "12")
    cy.get("@dec").click()
    cy.get("@value").should("have.value", "10")
  })

  it("should stop at max and min", () => {
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()
    cy.get("@inc").click()

    cy.get("@value").should("have.value", "15")

    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()
    cy.get("@dec").click()

    cy.get("@value").should("have.value", "10")
  })
})
