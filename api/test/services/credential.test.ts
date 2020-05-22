import assert from 'assert';
import app from '../../src/app';

describe('\'credential\' service', () => {
  it('registered the service', () => {
    const service = app.service('credential');

    assert.ok(service, 'Registered the service');
  });
});
