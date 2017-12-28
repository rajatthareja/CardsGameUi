import { TestBed, inject } from '@angular/core/testing';

import { BluffGameService } from './bluff-game.service';

describe('BluffGameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BluffGameService]
    });
  });

  it('should be created', inject([BluffGameService], (service: BluffGameService) => {
    expect(service).toBeTruthy();
  }));
});
