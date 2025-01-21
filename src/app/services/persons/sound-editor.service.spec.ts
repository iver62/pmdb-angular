import { TestBed } from '@angular/core/testing';

import { SoundEditorService } from './sound-editor.service';

describe('SoundEditorService', () => {
  let service: SoundEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
