import { DBClient } from '../../models/database/database.model';
import { EmailService } from '../../services/email.service';

export interface IValidateLink {
  _id: string;
  expired: boolean;
  active: boolean;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class InvitationService {
  constructor () {
    // this._client.connect();
  }

  async validateToken(
    linkId: string,
    client: DBClient,
  ): Promise<IValidateLink> {
    const res = await client.getRecordByQuery({
      collection: 'invitations',
      query: { linkId },
    });
    if (!res) return { _id: '', active: false, expired: true };
    if (res.issued) return { _id: res._id, active: true, expired: false, user: undefined }
    return {
      _id: res._id,
      active: res.active,
      expired: res.expiry.getTime() <= Date.now(),
      user: {
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email
      }
    };
  }

  async requestToken(opts: {
    email: string;
    linkId: string;
    client: DBClient;
    emailSvc: EmailService;
  }) {
    const { email, linkId, client, emailSvc } = opts;
    const res = await client.getRecordByQuery({
      collection: 'invitations',
      query: { linkId },
    });
    if (!res) throw new Error('no valid link found');
    await emailSvc.requestInvite({ address: email, signUpAddress: res.email });
  }
}
