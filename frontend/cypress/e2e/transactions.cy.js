describe('Navigation', () => {
  it('should navigate to the transactions page', () => {
    cy.visit('http://localhost:8080/transactions');

    cy.url().should('include', '/transactions');

    cy.get('h1').contains('Transações');
  });
});
