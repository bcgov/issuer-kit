import assert from 'assert';
import app from '../../src/app';

describe('\'mailer\' service', () => {
  it('registered the service', () => {
    const service = app.service('mailer');

    assert.ok(service, 'Registered the service');
  });
});
