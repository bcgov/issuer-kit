import assert from 'assert';
import app from '../../src/app';

describe('\'credential-exchange\' service', () => {
  it('registered the service', () => {
    const service = app.service('credential-exchange');

    assert.ok(service, 'Registered the service');
  });
});
