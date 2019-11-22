import test from 'ava';
import { EmailService } from './email.service';
import { resolve } from 'path';
const config = require('dotenv').config({
  path: resolve(__dirname, '../../../config.env')
});

const host = process.env.SMTP_HOST || '';
const port = parseInt(process.env.SMTP_PORT || '2525');
const user = process.env.SMTP_USERNAME || '';
const pass = process.env.SMTP_PASS || '';

const prefix = 'EMAIL: ';
test(prefix + 'should insert an invitation', async t => {
  t.log('hostname', host);
  const emailSvc = new EmailService({ host, port, user, pass });
  try {
    const address = 'sean.hamilton@quartech.com';
    const url = 'http://localhost:8051/test-link';
    const testMail = await emailSvc.mailInvite({
      address,
      url
    });
    t.is(testMail.accepted[0], address);
  } catch {}
});
