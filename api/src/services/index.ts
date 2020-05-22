import { Application } from "../declarations";
import issuerInvite from "./issuer-invite/issuer-invite.service";
import mailer from "./mailer/mailer.service";
// Don't remove this comment. It's needed to format import lines nicely.

export function services(app: Application) {
  app.configure(issuerInvite);
}

export function internalServices(app: Application) {
  app.configure(mailer);
}
