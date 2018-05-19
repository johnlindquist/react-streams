describe("Context", () => {
  beforeEach(() => {
    cy.command("launch", "context")
  })
  it("should display 'Hello'", () => {
    cy.get("#message").should("have.text", "Hello")
  })

  it("should change to 'On' when clicking on", () => {
    cy.get('[aria-label="change message to on"]').click()
    cy.get("#message").should("have.text", "On")
  })

  it("should change to the 'Off' when clicking off", () => {
    cy.get('[aria-label="change message to off"]').click()
    cy.get("#message").should("have.text", "Off")
  })
})
