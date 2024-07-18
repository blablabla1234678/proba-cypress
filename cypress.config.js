const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    baseUrl: 'http://localhost:8000/api',
    specPattern: [
        '**/users.spec.cy.js',
        '**/posts.spec.cy.js',
    ],
  },
});
