describe('login page', () => {
	beforeEach(() => {
		cy.request('DELETE', '/api/testing/clearDatabase');
		cy.visit('/');
	});

	it('loads page', () => {
		cy.contains(/welcome to messenger/i);
		cy.contains(/login/i);
		cy.contains(/register/i);
	});

	describe('registration form', () => {
		it('is successful when valid credentials', () => {
			cy.register('TestUsername', 'TestPassword');

			cy.contains(/created successfully/i).contains('TestUsername');
		});

		it('shows error when invalid username', () => {
			cy.register('Te', 'TestPassword');

			cy.contains(/created successfully/i).should('not.exist');
			cy.get('#registration-form').contains(/username must be at least 3 characters/);
		});

		it('shows error when invalid password', () => {
			cy.register('TestUsername', 'Test');

			cy.contains(/created successfully/i).should('not.exist');
			cy.get('#registration-form').contains(/password must be at least 8 characters/);
		});
	});

	describe('login form', () => {
		beforeEach(() => {
			cy.register('TestUsername', 'TestPassword');

			cy.contains(/created successfully/i).contains('TestUsername');
		});

		it('is successful when user exists', () => {
			cy.login('TestUsername', 'TestPassword');

			cy.contains(/logged in as TestUsername/i);

			cy.contains(/logout/i).click();

			cy.contains(/welcome to messenger/i);
		});

		it('shows error when invalid password', () => {
			cy.login('TestUsername', 'wrong');

			cy.contains(/Login failed! Incorrect username or password/i);
		});
	});
});
