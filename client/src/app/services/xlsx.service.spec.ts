import { TestBed } from '@angular/core/testing';

import { XlsxService } from './xlsx.service';

describe('XlsxService', () => {
    let service: XlsxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(XlsxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
