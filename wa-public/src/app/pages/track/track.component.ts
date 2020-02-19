import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionService } from 'src/app/services/action.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'wap-track',
  template: `
    <wap-header title="Issuing Credential" [logoutUrl]="logoutUrl"></wap-header>

    <ion-content *ngIf="$id | async as credExId" fullscreen>
      <wap-credential-issuance
        [credExId]="credExId"
      ></wap-credential-issuance>
    </ion-content>
  `,
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  readonly logoutUrl: string = `${AppConfigService.settings.baseUrl}/completed`;
  $id = new BehaviorSubject<string>(null);

  constructor(public actionSvc: ActionService, private route: ActivatedRoute) {}

  ngOnInit() {
    const credExId = this.route.snapshot.paramMap.get('id');
    this.$id.next(credExId);
  }
}
