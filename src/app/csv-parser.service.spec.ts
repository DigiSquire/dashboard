import { TestBed, inject } from '@angular/core/testing';

import { CsvParserService } from './csv-parser.service';

describe('CsvParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsvParserService]
    });
  });

  it('should be created', inject([CsvParserService], (service: CsvParserService) => {
    expect(service).toBeTruthy();
  }));
});
