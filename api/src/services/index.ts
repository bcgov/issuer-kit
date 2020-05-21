import { Application } from '../declarations';
import issuerInvite from './issuer-invite/issuer-invite.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(issuerInvite);
}
