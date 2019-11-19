import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardToolbarComponent } from './card-toolbar.component';

describe('CardToolbarComponent', () => {
  let component: CardToolbarComponent;
  let fixture: ComponentFixture<CardToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
