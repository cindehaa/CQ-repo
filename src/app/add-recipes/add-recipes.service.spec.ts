import { TestBed } from '@angular/core/testing';

import { AddRecipesService } from './add-recipes.service';

describe('AddRecipesService', () => {
  let service: AddRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
