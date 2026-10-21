import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { Subject } from 'rxjs';

import { ResumesPage } from './resumes.page';
import { ResumeService } from '../../services/resume.service';

describe('ResumesPage', () => {
  let component: ResumesPage;
  let service: { getResumes: ReturnType<typeof vi.fn> };
  let routerEvents: Subject<NavigationEnd>;

  beforeEach(() => {
    service = {
      getResumes: vi.fn().mockResolvedValue([]),
    };
    routerEvents = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      imports: [ResumesPage],
      providers: [
        provideRouter([]),
        provideIonicAngular(),
        { provide: ResumeService, useValue: service },
      ],
    });

    // Set up navigation events before the component subscribes to them.
    vi.spyOn(TestBed.inject(Router), 'events', 'get').mockReturnValue(
      routerEvents.asObservable()
    );

    component = TestBed.createComponent(ResumesPage).componentInstance;
  });

  it('reloads résumés when navigating back to the list', () => {
    routerEvents.next(new NavigationEnd(1, '/tabs/resumes', '/tabs/resumes'));

    expect(service.getResumes).toHaveBeenCalledTimes(1);
  });

  it('clears previously displayed résumés if reloading fails', async () => {
    service.getResumes.mockResolvedValueOnce([
      { id: 'one', title: 'Engineer' },
    ]);

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

    service.getResumes.mockReturnValueOnce(
      new Promise<unknown[]>((done) => {
        resolve = done;
      })
    );

    const pending = component.load();

    // Simulate navigating away while the request is still pending.
    routerEvents.next(new NavigationEnd(1, '/login', '/login'));

    resolve([{ id: 'one', title: 'Engineer' }]);
    await pending;

    expect(component.resumes()).toEqual([]);
  });
});
