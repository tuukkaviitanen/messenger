import {userPublicSchema} from '../../src/validators/UserPublic';

describe('chat page', () => {
	describe('chats', () => {
		const user = {username: 'initial-user', password: 'initial-password'};

		beforeEach(() => {
			cy.request('DELETE', '/api/testing/clearDatabase');

			cy.request('POST', '/api/users', user).then(response => {
				const user = userPublicSchema.parse(response.body);
				cy.request('POST', '/api/testing/setUserOnline', user);
				cy.visit('/');
				cy.register('TestUser', 'TestPassword');
				cy.login('TestUser', 'TestPassword');
			});
		});

		it('should return to login when logout is clicked', () => {
			cy.contains(/logout/i).click();

			cy.contains(/welcome to messenger/i);
		});

		it('should show message in global chat when sending message', () => {
			cy.sendChat('This is a test message!');
			cy.sendChat('This is a second test message!');

			cy.contains(/This is a test message!/);
			cy.contains(/This is a second test message!/);
		});

		it('should open a new separate chat when clicking on a user', () => {
			cy.sendChat('Good bye global chat!');

			cy.get('#users-container').contains('initial-user').click();

			cy.get('#chats-container').contains('initial-user');

			cy.contains(/Good bye global chat!/).should('not.exist');

			cy.sendChat('Hello another user!');
			cy.sendChat('This is a cool feature!');

			cy.contains(/Hello another user!/);
			cy.contains(/This is a cool feature!/);

			cy.get('#chats-container').contains('Global chat').click();

			cy.contains(/Hello another user!/).should('not.exist');
			cy.contains(/This is a cool feature!/).should('not.exist');

			cy.contains(/Good bye global chat!/);
		});
	});
});
