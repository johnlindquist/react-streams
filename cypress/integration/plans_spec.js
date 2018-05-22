describe("Text", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4321/plans")
  })

  it("should start with 'Hello'", () => {
    cy.get("#message").contains(/^Hello$/)
  })

  it("should change to 'Friends'", () => {
    cy.get("#input").type("Friends")
    cy.get("#message").should("have.text", "Friends")
  })

  it("should delete then type 'Hi'", () => {
    cy
      .get("#input")
      .clear()
      .type("Hi")
    cy.get("#message").should("have.text", "Hi")
  })
})
