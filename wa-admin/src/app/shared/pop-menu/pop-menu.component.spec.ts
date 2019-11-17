import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopMenuComponent } from './pop-menu.component';

describe('PopMenuComponent', () => {
  let component: PopMenuComponent;
  let fixture: ComponentFixture<PopMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
