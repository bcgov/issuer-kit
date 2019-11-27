import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTokenComponent } from './request-token.component';

describe('RequestTokenComponent', () => {
  let component: RequestTokenComponent;
  let fixture: ComponentFixture<RequestTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
