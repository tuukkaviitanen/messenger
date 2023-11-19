describe('chat page', () => {
	describe('send message', () => {
		beforeEach(() => {
			cy.request('DELETE', '/api/testing/clearDatabase');
			cy.visit('/');
			cy.register('TestUser', 'TestPassword');
			cy.login('TestUser', 'TestPassword');
		});

		it('shows message', () => {
			cy.sendChat('This is a test message!');
			cy.sendChat('This is a second test message!');

			cy.contains(/This is a test message!/);
			cy.contains(/This is a second test message!/);
		});
	});
});
