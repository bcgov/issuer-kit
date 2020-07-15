import assert from 'assert';
import app from '../../src/app';

describe('\'TokenValidation\' service', () => {
  it('registered the service', () => {
    const service = app.service('token/:token/validate');

    assert.ok(service, 'Registered the service');
  });
});
