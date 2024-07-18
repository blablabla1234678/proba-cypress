import data from '../fixtures/posts.json';

describe('posts', () => {
    it('can create and list posts', () => {
        cy.getUserWithToken('user1b');
        cy.getUserWithToken('user2');

        const ownership = {
            user1b: ['post1', 'post1b'],
            user2: ['post2']
        };
        for (let userName in ownership)
            for (let postName of ownership[userName])
                cy.get('@'+userName)
                    .then((user) => cy.request({
                        method: 'POST', 
                        url: 'posts',
                        body: data[postName],
                        headers: {
                            authorization: 'Bearer '+user.token.plainText
                        }
                    }));
        
        cy.request('GET', 'posts')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.length).to.eq(3);
                expect(response.body[0].title).to.eq(data.post1.title);
                expect(response.body[0].body).to.eq(data.post1.body);
                expect(response.body[1].title).to.eq(data.post1b.title);
                expect(response.body[1].body).to.eq(data.post1b.body);
                expect(response.body[2].title).to.eq(data.post2.title);
                expect(response.body[2].body).to.eq(data.post2.body);
            })
    });

    it('can list posts by the owner', () => {
        cy.getUserWithToken('user1b');
        
        cy.get('@user1b')
            .then((user) => cy.request('GET', `users/${user.id}/posts`))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.length).to.eq(2);
                expect(response.body[0].title).to.eq(data.post1.title);
                expect(response.body[0].body).to.eq(data.post1.body);
                expect(response.body[1].title).to.eq(data.post1b.title);
                expect(response.body[1].body).to.eq(data.post1b.body);
            });
    });

    it('can read and delete posts', () => {
        cy.getUserWithToken('user1b');
        cy.getPost('post1b');

        cy.get('@post1b')
            .then((post) => cy.request({
                method: 'GET', 
                url: `posts/${post.id}`
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.title).to.eq(data.post1b.title);
                expect(response.body.body).to.eq(data.post1b.body);
            });

        cy.aliases(['user1b', 'post1b'])
            .then(([user, post]) => cy.request({
                method: 'DELETE',
                url: `posts/${post.id}`,
                headers: {
                    authorization: 'Bearer '+user.token.plainText
                }
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
            });

        cy.get('@post1b')
            .then((post) => cy.request({
                method: 'GET', 
                url: `posts/${post.id}`,
                failOnStatusCode: false
            }))
            .then((response) => {
                expect(response.status).to.eq(404);
            });
    });


    it('can update a post', () => {
        cy.getUserWithToken('user1b');
        cy.getPost('post1');

        cy.get('@post1')
            .then((post) => cy.request({
                method: 'GET', 
                url: `posts/${post.id}`
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.title).to.eq(data.post1.title);
                expect(response.body.body).to.eq(data.post1.body);
            });

        cy.aliases(['user1b', 'post1'])
            .then(([user, post]) => cy.request({
                method: 'PUT',
                url: `posts/${post.id}`,
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer '+user.token.plainText
                },
                body: data.post1b
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.title).to.eq(data.post1b.title);
                expect(response.body.body).to.eq(data.post1b.body);
            });

        cy.get('@post1')
            .then((post) => cy.request({
                method: 'GET', 
                url: `posts/${post.id}`
            }))
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.title).to.eq(data.post1b.title);
                expect(response.body.body).to.eq(data.post1b.body);
            });
    });
});