import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ResumesPage } from './resumes.page';
import { ResumeService } from '../../services/resume.service';

describe('ResumesPage', () => {
  let component: ResumesPage;
  let service: { getResumes: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    service = { getResumes: vi.fn().mockResolvedValue([]) };
    TestBed.configureTestingModule({
      imports: [ResumesPage],
      providers: [
        provideRouter([]), provideIonicAngular(),
        { provide: ResumeService, useValue: service },
      ],
    });
    component = TestBed.createComponent(ResumesPage).componentInstance;
  });

  it('clears previously displayed résumés if reloading fails', async () => {
    service.getResumes.mockResolvedValueOnce([{ id: 'one', title: 'Engineer' }]);
    await component.load();
    expect(component.resumes()).toHaveLength(1);
    service.getResumes.mockRejectedValueOnce(new Error('permission-denied'));
    await component.load();
    expect(component.resumes()).toEqual([]);
    expect(component.error()).not.toBe('');
    expect(component.loading()).toBe(false);
  });

  it('ignores a request that finishes after leaving the page', async () => {
    let resolve!: (value: unknown[]) => void;
    service.getResumes.mockReturnValueOnce(new Promise(done => { resolve = done; }));
    const pending = component.load();
    component.ionViewWillLeave();
    resolve([{ id: 'one', title: 'Engineer' }]);
    await pending;
    expect(component.resumes()).toEqual([]);
  });
});
