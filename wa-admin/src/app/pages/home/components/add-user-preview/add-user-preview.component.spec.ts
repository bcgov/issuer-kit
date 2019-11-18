import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserPreviewComponent } from './add-user-preview.component';

describe('AddUserPreviewComponent', () => {
  let component: AddUserPreviewComponent;
  let fixture: ComponentFixture<AddUserPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
