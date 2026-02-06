describe('Drag and Drop ingredients', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  });

  it('should drag bun to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid="ingredient-bun"]').first().as('bun');
    cy.get('@bun')
      .invoke('attr', 'data-id')
      .then((id) => {
        cy.get('@bun').trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="burger-constructor-blank-bun"]')
          .first()
          .trigger('drop', { dataTransfer });
        cy.get('[data-testid="burger-constructor-bun"]').as('constructorBuns');
        cy.get('@constructorBuns').should('have.length', 2);
        cy.get('@constructorBuns').each((bunElement) => {
          cy.wrap(bunElement).invoke('attr', 'data-id').should('equal', id);
        });
      });
  });
  it('should drag ingredients to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid="ingredient-main"]').first().as('mainIngredient');
    cy.get('@mainIngredient')
      .invoke('attr', 'data-id')
      .then((mainId) => {
        cy.get('@mainIngredient').trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="burger-constructor-blank-ingredient"]')
          .first()
          .trigger('drop', { dataTransfer });

        cy.get('[data-testid="ingredient-sauce"]').first().as('sauceIngredient');
        cy.get('@sauceIngredient')
          .invoke('attr', 'data-id')
          .then((sauceId) => {
            cy.get('@sauceIngredient').trigger('dragstart', { dataTransfer });
            cy.get('[data-testid="burger-constructor-ingredients"]').as(
              'ingredientsContainer'
            );
            cy.get('@ingredientsContainer').first().trigger('drop', { dataTransfer });

            cy.get('@ingredientsContainer').children().as('ingredientsList');
            cy.get('@ingredientsList').should('have.length', 2);
            cy.get('@ingredientsList')
              .eq(0)
              .invoke('attr', 'data-id')
              .should('equal', mainId);
            cy.get('@ingredientsList')
              .eq(1)
              .invoke('attr', 'data-id')
              .should('equal', sauceId);
          });
      });
  });

  it('should drag equal ingredients to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid="ingredient-main"]').first().as('firstIngredient');
    cy.get('@firstIngredient')
      .invoke('attr', 'data-id')
      .then((id) => {
        cy.get('@firstIngredient').trigger('dragstart', { dataTransfer });
        cy.get('[data-testid="burger-constructor-blank-ingredient"]')
          .first()
          .trigger('drop', { dataTransfer });

        cy.get('@firstIngredient').first().trigger('dragstart', { dataTransfer });

        cy.get('[data-testid="burger-constructor-ingredients"]')
          .first()
          .as('ingredientsList');
        cy.get('@ingredientsList').trigger('drop', { dataTransfer });
        cy.get('@ingredientsList').children().should('have.length', 2);
        cy.get('@ingredientsList')
          .children()
          .each((element) => {
            cy.wrap(element).invoke('attr', 'data-id').should('equal', id);
          });
      });
  });
});
