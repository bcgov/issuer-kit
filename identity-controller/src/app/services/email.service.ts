import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { emailTemplate } from './invitation_email';


export class EmailService {
  transporter: Mail;
  adminEmail: string | undefined;
  constructor(opts: {
    host: string;
    port: number;
    user: string;
    pass: string;
  }) {
    const { host, port, user, pass } = opts;
    if (process.env.NODE_ENV === 'production') {
    const transport = nodemailer.createTransport({
      host: host,
      port: port,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
      logger: true,
      
    });
    this.transporter = transport;
    this.adminEmail = process.env.ADMIN_EMAIL;
    } else {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        auth: {
          user: process.env.SMTP_USERNAME || '',
          pass: process.env.SMTP_PASS,
        },
        logger: true,
        secure: false,
      });
      this.transporter = transport;
      this.adminEmail = process.env.ADMIN_EMAIL
      console.log('dev e-mail mode')
    }

  }

  async mailInvite(opts: { address: string; url: string }) {
    const { address, url } = opts;
    try {
      const mail = await this.transporter.sendMail({
        from: 'Identity Kit POC <no-reply@gov.bc.ca>',
        to: address,
        subject: 'Welcome to the Identity Kit POC test.',
        // TODO: @SH - change this to an env variable
        html: emailTemplate(url, 'peter.watkins@gov.bc.ca'),
      });
      return mail;
    } catch (err) {
      console.log(err);
    }
  }
}
