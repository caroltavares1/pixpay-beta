import { TestBed } from '@angular/core/testing';

import { ContasAReceberService } from './contas-areceber.service';

describe('ContasAReceberService', () => {
  let service: ContasAReceberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContasAReceberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
