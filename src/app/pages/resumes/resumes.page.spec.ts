import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumesPage } from './resumes.page';

describe('ResumesPage', () => {
  let component: ResumesPage;
  let fixture: ComponentFixture<ResumesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
