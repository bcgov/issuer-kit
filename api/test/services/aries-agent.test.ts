import assert from 'assert';
import app from '../../src/app';

describe('\'aries-agent\' service', () => {
  it('registered the service', () => {
    const service = app.service('aries-agent');

    assert.ok(service, 'Registered the service');
  });
});
