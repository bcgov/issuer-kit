import assert from 'assert';
import app from '../../src/app';

describe('\'connection\' service', () => {
  it('registered the service', () => {
    const service = app.service('connection');

    assert.ok(service, 'Registered the service');
  });
});
