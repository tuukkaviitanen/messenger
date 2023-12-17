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
				cy.contains(/created successfully/i);

				cy.login('TestUser', 'TestPassword');
				cy.contains(/Welcome to the messenger app/i); // Waits for socket connection
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

		it('should restore private chats on login', () => {
			cy.get('#users-container').contains('initial-user').click();
			cy.sendChat('This chat should be saved!');

			cy.contains(/logout/i).click();

			cy.reload(true);

			cy.login('TestUser', 'TestPassword');
			cy.get('#chats-container').contains('initial-user').click();

			cy.contains('This chat should be saved!');
		});

		it('should NOT restore private chats when other user logs in', () => {
			cy.get('#users-container').contains('initial-user').click();
			cy.sendChat('This chat should be saved!');

			cy.contains(/logout/i).click();

			cy.reload(true);

			cy.register('OtherUser', 'OtherPassword');

			cy.contains(/created successfully/i).click();

			cy.login('OtherUser', 'OtherPassword');
			cy.get('#chats-container').contains('initial-user').should('not.exist');

			cy.get('#users-container').contains('initial-user').click();

			cy.contains('This chat should be saved!').should('not.exist');
		});

		it('should restore global chat when page is refreshed', () => {
			cy.sendChat('This global chat should be saved to cache!');

			cy.contains(/logout/i).click();

			cy.reload();

			cy.login('TestUser', 'TestPassword');

			cy.contains('This global chat should be saved to cache!');
		});

		it('should restore global chat events when page is refreshed', () => {
			cy.reload();

			cy.contains('TestUser left the chat');
		});

		it('should not allow multiline messages when multiline button is toggled off', () => {
			// Multiple clicks to make sure that toggling works
			cy.get('#multiline-button').click();
			cy.get('#multiline-button').click();

			cy.sendChat('this\nis\na\nmultiline\nmessage');
			cy.contains('this is a multiline message').should('not.exist');
		});

		it('should allow multiline messages when multiline button is toggled on', () => {
			// Multiple clicks to make sure that toggling works
			cy.get('#multiline-button').click();
			cy.get('#multiline-button').click();
			cy.get('#multiline-button').click();

			cy.sendChat('this\nis\na\nmultiline\nmessage');
			cy.contains('this is a multiline message').should('have.html', 'this\nis\na\nmultiline\nmessage');
		});
	});
});
