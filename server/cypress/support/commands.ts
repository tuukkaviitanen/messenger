/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('register', (username: string, password: string) => {
	cy.get('#registration-form').find('input:first').type(username);
	cy.get('#registration-form').find('input:last').type(password);
	cy.get('#registration-form').find('button').click();
});

Cypress.Commands.add('login', (username: string, password: string) => {
	cy.get('#login-form').find('input:first').type(username);
	cy.get('#login-form').find('input:last').type(password);
	cy.get('#login-form').find('button').click();
});

Cypress.Commands.add('sendChat', (message: string) => {
	cy.get('#chat-form').get('#input-field').type(message);
	cy.contains(/send/i).click();
});

declare namespace Cypress{
	interface Chainable {
		register(username: string, password: string): Chainable<void>;
		login(username: string, password: string): Chainable<void>;
		sendChat(message: string): Chainable<void>;
	}
}
