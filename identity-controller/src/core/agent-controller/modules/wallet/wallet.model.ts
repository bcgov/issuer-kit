import { WalletService } from './wallet.service';

export class Wallet {
  private _walletSvc: WalletService;
  async publicDid() {
    return await this._walletSvc.getPublicDid();
  }
  constructor(url: string) {
    this._walletSvc = new WalletService(url);
  }
}
