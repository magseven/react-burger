describe('Drag and Drop ingredients', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  });

  it('should drag bun to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid="ingredient-bun"]')
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-testid="burger-constructor-blank-bun"]')
      .first()
      .trigger('drop', { dataTransfer });

    cy.get('[data-testid="burger-constructor-bun"]').should('have.length', 2);
  });

  it('should drag ingredients to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid="ingredient-main"]')
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-testid="burger-constructor-blank-ingredient"]')
      .first()
      .trigger('drop', { dataTransfer });

    cy.get('[data-testid="ingredient-sauce"]')
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-testid="burger-constructor-ingredients"]')
      .first()
      .trigger('drop', { dataTransfer });

    cy.get('[data-testid="burger-constructor-ingredients"]')
      .children()
      .should('have.length', 2);
  });

  it('should drag equal ingredients to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid="ingredient-main"]').first().as('firstIngredient');
    cy.get('@firstIngredient').trigger('dragstart', { dataTransfer });

    cy.get('[data-testid="burger-constructor-blank-ingredient"]')
      .first()
      .trigger('drop', { dataTransfer });

    cy.get('@firstIngredient').first().trigger('dragstart', { dataTransfer });

    cy.get('[data-testid="burger-constructor-ingredients"]')
      .first()
      .trigger('drop', { dataTransfer });

    cy.get('[data-testid="burger-constructor-ingredients"]')
      .children()
      .should('have.length', 2);
  });
});
