const { server } = require('./server');

test('Server "smoke" test', () => {
  expect(server).toBeDefined();
});
