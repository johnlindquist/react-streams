describe("Text", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4321/text")
  })

  it("should start with 'Hello'", () => {
    cy.get("#message").contains(/^Hello$/)
  })

  it("should change to 'Hello Friends'", () => {
    cy.get("#input").type(" Friends")
    cy.get("#message").contains(/^Hello Friends$/)
  })

  it("should delete then type 'Hi'", () => {
    cy
      .get("#input")
      .clear()
      .type("Hi")
    cy.get("#message").contains(/^Hi$/)
  })
})
