describe("add to cart", () => {
  it("verify that the configurable product is added to cart", () => {
    cy.visit("/p/WS01/gwyn-endurance-tee-1577/WS01");
    cy.get('[aria-label="Select color Green"]').click();
    cy.get('[aria-label="Select color Green"]').click();
    cy.get('[aria-label="Select size L"]').click();
    cy.get("[data-testid=addToCart]").click();
    cy.wait(200);
    cy.get("[data-testid=notificationMessage]").contains(
      "Product has been added to the cart!"
    );
    cy.get("[data-testid=openMicrocart]").click({ force: true });
    cy.get("[data-testid=productSku]").contains("WS01-L-Green");
    cy.get("[data-testid=closeMicrocart]").click();
  });

  it("verify that the bundle product is added to cart", () => {
    cy.visit("/p/24-WG080/sprite-yoga-companion-kit-45");
    cy.get("#bundleOption_74_1_2").click({ force: true });
    cy.get("#bundleOptionQty_1")
      .clear()
      .type("2");
    cy.get("#bundleOption_77_4_8").click({ force: true });
    cy.get("#bundleOptionQty_4")
      .clear()
      .type("3");
    cy.get("[data-testid=addToCart]").click();
    cy.get("[data-testid=notificationMessage]").contains(
      "Product has been added to the cart!"
    );
    cy.get("[data-testid=openMicrocart]").click({ force: true });
    cy.get(".prices > .h4").contains("159.90");
    cy.get("[data-testid=closeMicrocart]").click();
  });
});
