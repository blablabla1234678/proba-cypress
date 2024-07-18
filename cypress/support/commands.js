// ***********************************************
// This example commands.js shows you how to
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

import usersData from '../fixtures/users.json';
import postData from '../fixtures/posts.json';

Cypress.Commands.add('aliases', (aliasNames) => { 
    return aliasNames.map(alias => cy.state('ctx')[alias]);
});

Cypress.Commands.add('getUserWithToken', (name) => {
    const aliases = cy.state('aliases');
    if (aliases && aliases[name])
        return;
    return cy.request('GET', 'users')
        .then((response) => {
            for (let user of response.body)
                if (user.email == usersData[name].email){
                    cy.wrap(user).as(name);
                    break;
                }
        })
        .then(() => cy.request('POST','tokens', {email: usersData[name].email, password: usersData[name].password}))
        .then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("plainText");
            cy.get("@"+name).then((user) => {user.token = response.body;});
        });
});

Cypress.Commands.add('getPost', (name) => {
    const aliases = cy.state('aliases');
    if (aliases && aliases[name])
        return;
    return cy.request('GET', 'posts')
        .then((response) => {
            for (let post of response.body)
                if (post.title == postData[name].title){
                    cy.wrap(post).as(name);
                    break;
                }
        });
});