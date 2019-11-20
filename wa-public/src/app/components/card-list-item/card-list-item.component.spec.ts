import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListItemComponent } from './card-list-item.component';

describe('CardListItemComponent', () => {
  let component: CardListItemComponent;
  let fixture: ComponentFixture<CardListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
