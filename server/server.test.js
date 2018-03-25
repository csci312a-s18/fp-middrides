const { app } = require('./server');

test('Server "smoke" test', () => {
  expect(app).toBeDefined();
});
