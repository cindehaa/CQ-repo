import { TestBed } from '@angular/core/testing';

import { ViewRecipesService } from './view-recipes.service';

describe('ViewRecipesService', () => {
  let service: ViewRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
