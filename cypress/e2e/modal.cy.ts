describe('Ingredient Details Modal', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  });

  it('should open modal when clicking on ingredient', () => {
    cy.get('[data-testid="ingredient-bun"]').first().click();

    cy.get('[data-testid="modal-overlay"]').should('exist');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="ingredient-details"]').should('be.visible');
    cy.get('[data-testid="modal-close-button"]').should('be.visible');
  });

  it('should close modal by clicking close button', () => {
    cy.get('[data-testid="ingredient-main"]').first().click();
    cy.get('[data-testid="modal-close-button"]').click();

    cy.get('[data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="modal-overlay"]').should('not.exist');
  });

  it('should close modal by clicking on overlay', () => {
    cy.get('[data-testid="ingredient-sauce"]').first().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
