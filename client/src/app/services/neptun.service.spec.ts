import { TestBed } from '@angular/core/testing';

import { NeptunService } from './neptun.service';

describe('NeptunService', () => {
    let service: NeptunService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NeptunService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
