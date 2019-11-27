import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptDisclaimerComponent } from './accept-disclaimer.component';

describe('AcceptDisclaimerComponent', () => {
  let component: AcceptDisclaimerComponent;
  let fixture: ComponentFixture<AcceptDisclaimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptDisclaimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
