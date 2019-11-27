import * as request from 'superagent';

const apiUrl = 'http://localhost:8051/';

export class WalletService {
  _url: string;
  constructor(url: string) {
    this._url = url;
  }

  async getDids() {
    try {
      const res = await request.get(`${this._url}wallet/did`);
      return res.body;
    } catch (err) {
      throw err;
    }
  }

  async createDid() {
    try {
      const res = await request.post(`${this._url}wallet/did/create`);
      return res.body;
    } catch (err) {
      throw err;
    }
  }

  async getPublicDid() {
    try {
      const res = await request.get(`${this._url}wallet/did/public`);
      return res.body;
    } catch (err) {
      throw err;
    }
  }

  async assignPublicWalletDid(did: string) {
    try {
      const res = await request
        .post(`${this._url}wallet/did/public`)
        .query({ did });
      return res.body;
    } catch (err) {
      throw err;
    }
  }
}
