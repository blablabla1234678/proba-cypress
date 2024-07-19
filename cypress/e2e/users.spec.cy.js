import data from '../fixtures/users.json';

describe('users', () => {
    it('can create and list users', () => {
		const names = ['user1', 'user1b', 'user2'];
		for (let name of names)
            cy.then(() => cy.request('POST', 'users', data[name]))
                .then((response) => null);
        
        cy.then(() => cy.request('GET', 'users'))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.length).to.eq(3);
                expect(response.body[0].name).to.eq(data.user1.name);
                expect(response.body[0].email).to.eq(data.user1.email);
                expect(response.body[1].name).to.eq(data.user1b.name);
                expect(response.body[1].email).to.eq(data.user1b.email);
                expect(response.body[2].name).to.eq(data.user2.name);
                expect(response.body[2].email).to.eq(data.user2.email);
            })
    });

    it('can read and delete an user', () => {
        cy.getUserWithToken('user1b');

        cy.get('@user1b')
            .then((user1b) => cy.request({
                method: 'GET', 
                url: `users/${user1b.id}`
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq(data.user1b.name);
                expect(response.body.email).to.eq(data.user1b.email);
            });

        cy.get('@user1b')
            .then((user1b) => cy.request({
                method: 'DELETE',
                url: `users/${user1b.id}`,
                headers: {
                    authorization: 'Bearer '+user1b.token.plainText
                }
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
            });

        cy.get('@user1b')
            .then((user1b) => cy.request({
                method: 'GET', 
                url: `users/${user1b.id}`,
                failOnStatusCode: false
            }))
            .then((response) => {
                expect(response.status).to.eq(404);
            });

    });

    it('can update an user', () => {
        cy.getUserWithToken('user1');

        cy.get('@user1')
            .then((user1) => cy.request({
                method: 'GET', 
                url: `users/${user1.id}`
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq(data.user1.name);
                expect(response.body.email).to.eq(data.user1.email);
            });

        cy.get('@user1')
            .then((user1) => cy.request({
                method: 'PUT',
                url: `users/${user1.id}`,
                headers: {
                    authorization: 'Bearer '+user1.token.plainText
                },
                body: data.user1b
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq(data.user1b.name);
                expect(response.body.email).to.eq(data.user1b.email);
            });

        cy.get('@user1')
            .then((user1) => cy.request({
                method: 'GET', 
                url: `users/${user1.id}`
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq(data.user1b.name);
                expect(response.body.email).to.eq(data.user1b.email);
            });
    });


});