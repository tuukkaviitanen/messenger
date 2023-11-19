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
			cy.get('#registration-form').find('input:first').type('TestUsername');
			cy.get('#registration-form').find('input:last').type('TestPassword');
			cy.get('#registration-form').find('button').click();
			cy.contains(/created successfully/i).contains('TestUsername');
		});

		it('shows error when invalid username', () => {
			cy.get('#registration-form').find('input:first').type('Test');
			cy.get('#registration-form').find('input:last').type('TestPassword');
			cy.get('#registration-form').find('button').click();
			cy.contains(/created successfully/i).should('not.exist');
			cy.get('#registration-form').contains(/username must be at least 8 characters/);
		});

		it('shows error when invalid password', () => {
			cy.get('#registration-form').find('input:first').type('TestUsername');
			cy.get('#registration-form').find('input:last').type('Test');
			cy.get('#registration-form').find('button').click();
			cy.contains(/created successfully/i).should('not.exist');
			cy.get('#registration-form').contains(/password must be at least 8 characters/);
		});
	});

	describe('login form', () => {
		beforeEach(() => {
			cy.get('#registration-form').find('input:first').type('TestUsername');
			cy.get('#registration-form').find('input:last').type('TestPassword');
			cy.get('#registration-form').find('button').click();
			cy.contains(/created successfully/i).contains('TestUsername');
		});

		it('is successful when user exists', () => {
			cy.get('#login-form').find('input:first').type('TestUsername');
			cy.get('#login-form').find('input:last').type('TestPassword');
			cy.get('#login-form').find('button').click();
			cy.contains(/logged in as TestUsername/i);
		});

		it('shows error when invalid credentials', () => {
			cy.get('#login-form').find('input:first').type('Test');
			cy.get('#login-form').find('input:last').type('TestPassword');
			cy.get('#login-form').find('button').click();
			cy.contains(/Login failed! Incorrect username or password/i);
		});
	});
});
