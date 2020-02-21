import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'wap-terms-and-conditions',
  templateUrl: '../../../assets/docs/terms-and-conditions.html',
  styleUrls: ['../../../assets/docs/terms-and-conditions.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  htmlContent: string;

  constructor() {
    this.htmlContent = AppConfigService.settings.disclaimer;
   }

  ngOnInit() {
  }

}
