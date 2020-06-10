import assert from 'assert';
import app from '../../src/app';

describe('\'webhooks\' service', () => {
  it('registered the service', () => {
    const service = app.service('webhooks/:topic');

    assert.ok(service, 'Registered the service');
  });
});
