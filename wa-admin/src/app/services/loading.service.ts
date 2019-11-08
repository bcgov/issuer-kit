import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  async startLoad(opts: { duration?: number, message?: string, }): Promise<HTMLIonLoadingElement> {
    const {duration = 5000, message = 'Please wait'} = opts;
    const loading = await this.loadingController.create({
      duration, message
    })
    return loading;
  }

  constructor(
    private loadingController: LoadingController
  ) { }
}
