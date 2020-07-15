import assert from 'assert';
import app from '../../src/app';

describe('\'IssuerInvite\' service', () => {
  it('registered the service', () => {
    const service = app.service('issuer-invite');

    assert.ok(service, 'Registered the service');
  });
});
