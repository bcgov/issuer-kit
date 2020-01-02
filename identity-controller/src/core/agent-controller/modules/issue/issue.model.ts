import { IssueService } from './issue.service';
import {
  ICredentialAttributes,
  IIssueSend,
  IIssueOffer,
  IRecordsResult,
} from '../../../interfaces/issue-credential.interface';

export type IssueCredentialRecordStateType =
  | 'offer_sent'
  | 'offer_received'
  | 'request_sent'
  | 'proposal_sent'
  | 'proposal_received'
  | 'request_received'
  | 'issued'
  | 'credential_received'
  | 'stored';

export type IssueCredentialFilterType = 'state' | 'credential_exchange_id';

export class Issue {
  private _issueSvc: IssueService;

  /*
    Issue credential filter has no query parameters on the API so we must filter here
  */
  filterIssueCrendentials(
    key: IssueCredentialFilterType,
    val: IssueCredentialRecordStateType | string,
    records: any[],
  ) {
    return records.filter(itm => itm[key] === val);
  }

  private formatSendCred(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credDefId: string,
  ): IIssueSend | null {
    const formatAttrs = this.formatAttrs(attrs);
    if (Array.isArray(formatAttrs)) {
      return {
        connection_id: connId,
        comment,
        credential_definition_id: credDefId,
        // credential_proposal: {
        // '@type':
        // 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-proposal',
        // attributes: formatAttrs
        // },
        credential_preview: {
          attributes: formatAttrs,
        },
        auto_issue: false,
        auto_offer: false,
      };
    } else return null;
  }

  private formatSendOffer(
    connection_id: string,
    comment: string,
    attributes: ICredentialAttributes[],
    cred_def_id: string,
    autoIssue: boolean = false,
  ): IIssueOffer {
    return {
      connection_id,
      comment,
      cred_def_id,
      credential_preview: {
        attributes: attributes,
        // '@type':
        // 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-proposal',
      },
      auto_issue: false,
    };
  }

  private formatAttrs(attrs: ICredentialAttributes | ICredentialAttributes[]) {
    if (Array.isArray(attrs)) {
      let retAttrs: ICredentialAttributes[] = [];
      for (let attr of attrs) {
        let res = this.formatAttrs(attr) as any;
        retAttrs.push(res);
      }
      return retAttrs;
    }

    return {
      name: attrs.name,
      value: attrs.value,
    };
  }

  constructor(url: string) {
    this._issueSvc = new IssueService(url);
  }

  async records(): Promise<IRecordsResult[]> {
    try {
      let res = await this._issueSvc.getIssueCredentialRecords();
      return res.body.results;
    } catch (err) {
      throw new Error(err.message);
    }
  }


  async issueAndSendCred(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credDefId: string,
  ) {
    const cred = this.formatSendCred(connId, comment, attrs, credDefId);

    try {
      if (cred != null) {
        let res = await this._issueSvc.issueCredentialSend(cred);
        return res.body;
      } else {
        throw new Error('cred not defined');
      }
    } catch (err) {
      return err;
    }
  }

  /*
    Issue an offer to another agent through the admin agent API for AcaPy.
    The foreign agent must then use send request in response to the offer that is
    sent
  */
  async issueOfferSend(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credDefId: string,
  ) {
    const credOffer = this.formatSendOffer(connId, comment, attrs, credDefId);
    try {
      if (credOffer != null) {
        const res = await this._issueSvc.sendOffer(credOffer);
        if (res.body) return res.body;
        throw new Error('no credential created');
      } else {
        throw new Error('cred offer not defined');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
  /*
    issue an offer in response to a proposal from a foreign agent;
  */

  async sendOfferById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'send-offer');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    send a request in response to a credential offer from a foreign agent;
  */
  async sendRequestById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'send-request');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    send an issued credential in response to a request from a foreign agent
  */
  async sendIssueById(
    credExId: string,
    attributes: ICredentialAttributes[],
    comment: string,
    // TODO: this is hard-coded until it becomes a problem
    type: string = 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview',
  ) {
    let credential_preview = {
      credential_preview: {
        '@type': type,
        attributes,
      },
      comment,
    };
    try {
      let res = await this._issueSvc.postById(
        credExId,
        'issue',
        credential_preview,
      );
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    store a credential record in response to an issued credential stage from a foreign agent
  */

  async sendStoreById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'store');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async removeById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'remove');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async removeAllRecords() {
    let records = await this.records();
    for (let record of records) {
      this.removeById(record.credential_exchange_id);
    }
  }
}
