import { DBClient } from '../../models/database/database.model';

export interface IValidateLink {
  _id: string;
  expired: boolean;
  active: boolean;
}

export class InvitationService {
  constructor() {
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
    return {
      _id: res._id,
      active: res.active,
      expired: res.expiry.getTime() <= Date.now(),
    };
  }
}
