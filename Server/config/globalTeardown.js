require('@babel/register');

const server = require('../../src/app').default;

module.exports = async () => {
    global.httpServer = server;
    await global.httpServer.listen();
};

//globalTeardown.js
module.exports = async () => {
    await global.httpServer.stop();
};