describe('Navigation', () => {
  it('should navigate to the users page', () => {
    cy.visit('http://localhost:8080/users');

    cy.url().should('include', '/users');

    cy.get('h1').contains('Usuários cadastrados');
  });
});
