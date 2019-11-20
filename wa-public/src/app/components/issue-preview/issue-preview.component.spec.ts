import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePreviewComponent } from './issue-preview.component';

describe('IssuePreviewComponent', () => {
  let component: IssuePreviewComponent;
  let fixture: ComponentFixture<IssuePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
