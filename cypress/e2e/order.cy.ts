describe('Ingredient Details Modal', () => {
  const mockOrderNumber = '999999';
  beforeEach(() => {
    cy.visit('/#/login');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'orders.json' });
    cy.get('[data-testid="login-button"]').click();
  });

  it('should open modal on order create', () => {
    const dataTransfer = new DataTransfer();
    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[data-testid="burger-constructor-blank-bun"]')
      .first()
      .trigger('drop', { dataTransfer });
    cy.get('[data-testid="ingredient-main"]')
      .first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[data-testid="burger-constructor-blank-ingredient"]')
      .first()
      .trigger('drop', { dataTransfer });
    cy.get('[data-testid="order-button"]').click();
    cy.get('[data-testid="modal-overlay"]').should('exist');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-details-number"]').as('orderNumber');
    cy.get('@orderNumber').should('be.visible');
    cy.get('@orderNumber')
      .invoke('attr', 'data-id')
      .then((orderNumber) => {
        expect(orderNumber).to.eq(mockOrderNumber);
      });
  });
});
